import {
    ApplicationCommandOptionType,
    Client,
    ClientEvents,
    Collection,
    GatewayIntentBits,
    Guild,
    GuildBasedChannel,
    Partials,
    RESTPostAPIApplicationCommandsJSONBody,
    RESTPostAPIApplicationGuildCommandsJSONBody,
    RestEvents,
    Routes,
    User
} from "discord.js";
import * as path from "node:path";
import { getConfig } from "../utils/configuration";
import { DirectoryWalkerEntry, directoryWalker } from "../utils/directory-walker";
import logger from "../utils/logger";
import uncacheModule from "../utils/uncache-module";
import Command from "./modules/Command";
import ClientEvent from "./modules/events/ClientEvent";
import RestEvent from "./modules/events/RestEvent";
import Autocompletion from "./modules/interactions/Autocompletion";
import Button from "./modules/interactions/Button";
import Menu from "./modules/interactions/Menu";
import Modal from "./modules/interactions/Modal";
import SlashCommand from "./modules/interactions/SlashCommand";
import SlashCommandSubCommand from "./modules/interactions/SlashCommandSubCommand";
import PresenceController from "../controllers/PresenceController";
import IExecutorModule from "./modules/executors/IExecutorModule";
import IRawExecutorModule from "./modules/executors/IRawExecutorModule";
import IExecutorMetadata from "./modules/executors/IExecutorMetadata";

export default class Bot extends Client {
    public commands = new Collection<string, Command>();
    public interactions = {
        commands: new Collection<string, SlashCommand>(),
        subcommands: new Collection<string, SlashCommandSubCommand>(),
        autocompletions: new Collection<string, Autocompletion>(),
        buttons: new Collection<string, Button>(),
        menus: new Collection<string, Menu>(),
        modals: new Collection<string, Modal>()
    };
    public events: (ClientEvent<keyof ClientEvents> | RestEvent<keyof RestEvents>)[] = [];
    public executors: IExecutorModule<any>[] = [];
    public owners: User[] = [];
    public createdAt;
    public startedAt: number = 0;
    public developmentMode!: {
        guild: Guild;
        channels: GuildBasedChannel[];
        enabled: boolean;
    };
    public controllers = {
        presence: new PresenceController(this)
    };

    private _loaded: boolean = false;

    get loaded() {
        return this._loaded;
    }

    set loaded(x: boolean) {
        if (x) this.startedAt = Date.now();
        this._loaded = x;
    }

    public constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.DirectMessages
            ],
            partials: [Partials.Message, Partials.Reaction, Partials.Channel],
            allowedMentions: { repliedUser: false, parse: ["users"] }
        });
        if (!process.env.BOT_TOKEN?.trim()) {
            logger.run(`BOT_TOKEN is not specified in the .env file`, {
                color: "red",
                scope: "Fatal"
            });
            process.exit();
        }
        this.createdAt = Date.now();
        this.rest.setToken(process.env.BOT_TOKEN.trim());
    }

    public async load() {
        await Promise.all([
            this.loadCommands(),
            this.loadInteractionCommands(),
            this.loadInteractionSubcommands(),
            this.loadInteractionAutocompletions(),
            this.loadInteractionButtons(),
            this.loadInteractionMenus(),
            this.loadInteractionModals(),
            this.loadEvents(),
            this.loadOwners(),
            this.loadDeveloperModeData()
        ]);

        await this.loadExecutors();
    }

    private async loadModules<
        ModuleType extends
            | Command
            | SlashCommand
            | SlashCommandSubCommand
            | Autocompletion
            | Button
            | Menu
            | Modal
            | IRawExecutorModule<any>
    >(
        where:
            | "commands"
            | "interactions/commands"
            | "interactions/subcommands"
            | "interactions/autocompletions"
            | "interactions/buttons"
            | "interactions/menus"
            | "interactions/modals"
            | "executors"
    ): Promise<Collection<string, { module: ModuleType; path: string }>> {
        const collection = new Collection<string, { module: ModuleType; path: string }>();

        let elements;
        try {
            elements = (
                await directoryWalker(path.join(require.main?.path || "", where))
            ).filter(e => e.path.endsWith(".ts") || e.path.endsWith(".js"));
        } catch (err) {
            return collection;
        }

        await Promise.all(
            elements.map(async element => {
                if (element.data.isDirectory() || element.data.name.startsWith("_"))
                    return;
                uncacheModule(element.path);
                if (where === "executors") {
                    const module = (await import(element.path)) as ModuleType;
                    collection.set(element.path, { module, path: element.path });
                } else {
                    const module = (await import(element.path)).default as ModuleType;
                    const name = (module as any).name
                        ? (module as any).name
                        : (module as any).data?.name;
                    if (!name) {
                        logger.run(`Module name was not found: ${element.path}`, {
                            color: "red",
                            scope: "Fatal"
                        });
                        process.exit();
                    }
                    collection.set(name, { module, path: element.path });
                }
            })
        );

        return collection;
    }

    private async loadCommands() {
        this.commands = (await this.loadModules<Command>("commands")).mapValues(
            e => e.module
        );
        logger.run(
            `Loaded commands: ${this.commands.map(e => e.name).join(", ") || "None"}`,
            {
                color: "blue",
                stringBefore: "\n",
                scope: "Bot"
            }
        );
    }

    private async loadInteractionCommands() {
        this.interactions.commands = (
            await this.loadModules<SlashCommand>("interactions/commands")
        ).mapValues(e => e.module);
        logger.run(
            `Loaded slash commands: ${
                this.interactions.commands.map(e => e.data.name).join(", ") || "None"
            }`,
            {
                color: "blue",
                scope: "Bot"
            }
        );
    }

    private async loadInteractionSubcommands() {
        this.interactions.subcommands = (
            await this.loadModules<SlashCommandSubCommand>("interactions/subcommands")
        ).mapValues(e => e.module);
        logger.run(
            `Loaded slash commands subcommands: ${
                this.interactions.subcommands
                    .map(
                        e =>
                            `${e.parent.command}${
                                e.parent.group ? `/${e.parent.group}` : ""
                            }/${e.data.name}`
                    )
                    .join(", ") || "None"
            }`,
            {
                color: "blue",
                scope: "Bot"
            }
        );
    }

    private async loadInteractionAutocompletions() {
        this.interactions.autocompletions = (
            await this.loadModules<Autocompletion>("interactions/autocompletions")
        ).mapValues(e => e.module);
        logger.run(
            `Loaded slash commands autocompletions: ${
                this.interactions.autocompletions.map(e => e.name).join(", ") || "Ninguna"
            }`,
            {
                color: "blue",
                scope: "Bot"
            }
        );
    }

    private async loadInteractionButtons() {
        this.interactions.buttons = (
            await this.loadModules<Button>("interactions/buttons")
        ).mapValues(e => e.module);
        logger.run(
            `Loaded button interactions: ${
                this.interactions.buttons.map(e => e.name).join(", ") || "Ninguna"
            }`,
            {
                color: "blue",
                scope: "Bot"
            }
        );
    }

    private async loadInteractionMenus() {
        this.interactions.menus = (
            await this.loadModules<Menu>("interactions/menus")
        ).mapValues(e => e.module);
        logger.run(
            `Loaded menu interactions: ${
                this.interactions.menus.map(e => e.name).join(", ") || "Ninguna"
            }`,
            {
                color: "blue",
                scope: "Bot"
            }
        );
    }

    private async loadInteractionModals() {
        this.interactions.modals = (
            await this.loadModules<Modal>("interactions/modals")
        ).mapValues(e => e.module);
        logger.run(
            `Loaded modal interactions: ${
                this.interactions.modals.map(e => e.name).join(", ") || "Ninguna"
            }`,
            {
                color: "blue",
                scope: "Bot"
            }
        );
    }

    private async loadEvents() {
        this.removeAllListeners();
        this.rest.removeAllListeners();

        const events: (ClientEvent<keyof ClientEvents> | RestEvent<keyof RestEvents>)[] =
            [];

        let files: DirectoryWalkerEntry[] = [];
        try {
            files = (
                await directoryWalker(path.join(require.main?.path || "", `events`))
            ).filter(e => e.path.endsWith(".ts") || e.path.endsWith(".js"));
        } catch (err) {
            return events;
        }

        await Promise.all(
            files.map(async file => {
                if (file.data.isDirectory()) return;

                uncacheModule(file.path);
                const event:
                    | ClientEvent<keyof ClientEvents>
                    | RestEvent<keyof RestEvents> = (await import(file.path)).default;
                events.push(event);

                if (event instanceof ClientEvent) {
                    if (event.once) {
                        this.once(event.name, (...args) => {
                            if (event.name !== "ready" && !this.loaded) return;
                            event.run.apply(null, [this, ...args]);
                        });
                    } else {
                        this.on(event.name, (...args) => {
                            if (!this.loaded) return;
                            event.run.apply(null, [this, ...args]);
                        });
                    }
                }

                if (event instanceof RestEvent) {
                    if (event.once) {
                        this.rest.once(event.name, (...args: any) => {
                            if (!this.loaded) return;
                            event.run.apply(null, [this, ...args] as any);
                        });
                    } else {
                        this.rest.on(event.name, (...args: any) => {
                            if (!this.loaded) return;
                            event.run.apply(null, [this, ...args] as any);
                        });
                    }
                }
            })
        );

        this.events = events;
        logger.run(
            `Loaded client events: ${
                this.events
                    .filter(e => e instanceof ClientEvent)
                    .map(e => e.name)
                    .join(", ") || "None"
            }`,
            {
                color: "blue",
                scope: "Bot"
            }
        );
        logger.run(
            `Loaded Discord's REST API events: ${
                this.events
                    .filter(e => e instanceof RestEvent)
                    .map(e => e.name)
                    .join(", ") || "None"
            }`,
            {
                color: "blue",
                scope: "Bot"
            }
        );
    }

    private async loadOwners() {
        const owners = (
            await Promise.all(
                getConfig().owners.map(async id => {
                    let user: User | null = null;
                    try {
                        user = await this.users.fetch(id);
                    } catch (err) {}
                    return user;
                })
            )
        ).filter(e => e) as User[];

        const missingOwners = getConfig().owners.filter(
            e => !owners.some(u => u.id === e)
        );
        if (missingOwners.length) {
            logger.run(
                `The following owner user IDs were not found: ${missingOwners.join(
                    ", "
                )}`,
                { color: "red", scope: "Fatal" }
            );
            process.exit();
        }

        this.owners = owners;

        logger.run(
            `Loaded owners: ${
                this.owners.map(e => `${e.tag} (ID: ${e.id})`).join(", ") || "None"
            }`,
            {
                color: "blue",
                scope: "Bot"
            }
        );
    }

    private async loadDeveloperModeData() {
        let guild: Guild;
        try {
            guild = await this.guilds.fetch(getConfig().developmentMode.guild.id);
            if (!guild) throw new Error();
        } catch (err) {
            logger.run(
                `Development guild ID not found: ${getConfig().developmentMode.guild.id}`,
                { color: "red", scope: "Fatal" }
            );
            process.exit();
        }

        const channels = (
            await Promise.all(
                getConfig().developmentMode.channels.map(async id => {
                    let channel: GuildBasedChannel | null = null;
                    try {
                        channel = await guild.channels.fetch(id);
                    } catch (err) {}
                    return channel;
                })
            )
        ).filter(e => e) as GuildBasedChannel[];

        const missingChannels = getConfig().developmentMode.channels.filter(
            e => !channels.some(c => c.id === e)
        );
        if (missingChannels.length) {
            logger.run(
                `The following developer channel IDs were not found in "${
                    guild.name
                }" (ID: ${guild.id}): ${missingChannels.join(", ")}`,
                { color: "red", scope: "Fatal" }
            );
            process.exit();
        }

        this.developmentMode = {
            enabled: getConfig().developmentMode.enabled,
            guild,
            channels
        };

        logger.run(
            `Development guild: ${this.developmentMode.guild.name} (ID: ${this.developmentMode.guild.id})`,
            {
                color: "blue",
                ignore: !getConfig().developmentMode.enabled,
                scope: "Bot",
                stringBefore: "\n"
            }
        );
        logger.run(`Development channels:`, {
            color: "blue",
            ignore: !getConfig().developmentMode.enabled,
            scope: "Bot"
        });
        this.developmentMode.channels.forEach(channel => {
            logger.run(`#${channel.name} (ID: ${channel.id})`, {
                color: "blue",
                ignore: !getConfig().developmentMode.enabled,
                scope: "Bot"
            });
        });
    }

    private async loadExecutors() {
        const rawExecutors = await this.loadModules<IRawExecutorModule<any>>("executors");
        this.executors = rawExecutors.map(({ module, path }) => {
            const command = this.commands.get(module.metadata.relations.command);
            const slashCommand =
                module.metadata.relations.slashCommand.type === "command"
                    ? this.interactions.commands.get(
                          module.metadata.relations.slashCommand.name
                      )
                    : this.interactions.subcommands.get(
                          module.metadata.relations.slashCommand.name
                      );
            if (!command) {
                logger.run(
                    `Command "${module.metadata.relations.command}" related to the following executor was not found: ${path}`,
                    {
                        color: "red",
                        scope: "Fatal"
                    }
                );
                process.exit();
            }
            if (!slashCommand) {
                logger.run(
                    `${
                        module.metadata.relations.slashCommand.type === "command"
                            ? "Slash command"
                            : "Slash command subcommand"
                    } "${
                        module.metadata.relations.slashCommand.name
                    }" related to the following executor was not found: ${path}`,
                    {
                        color: "red",
                        scope: "Fatal"
                    }
                );
                process.exit();
            }
            return {
                metadata: {
                    relations: {
                        command,
                        slashCommand
                    },
                    permissions: module.metadata.permissions
                },
                executor: module.default
            } as IExecutorModule<any>;
        });
        logger.run(
            `Command executors loaded: ${
                this.executors
                    .map(
                        e =>
                            `${e.metadata.relations.command.name} & ${e.metadata.relations.slashCommand.name}`
                    )
                    .join(", ") || "None"
            }`,
            {
                color: "blue",
                scope: "Bot"
            }
        );
    }

    public async start() {
        try {
            await this.login(process.env.BOT_TOKEN);
            this.startedAt = Date.now();
        } catch (err: any) {
            logger.run(
                `Error while starting the client:\n${err.stack ? err.stack : err}`,
                {
                    color: "red",
                    scope: "Fatal"
                }
            );
            process.exit();
        }
    }

    public searchExecutor<O>(commandName: string, slashCommandName: string) {
        const executor = this.executors.find(
            e =>
                e.metadata.relations.command.name === commandName &&
                e.metadata.relations.slashCommand.name === slashCommandName
        );
        if (!executor) throw new Error("Executor not found");
        return executor as IExecutorModule<O>;
    }

    public getExecutor<O>(relationsData: IExecutorMetadata["relations"]) {
        const executor = this.executors.find(
            e =>
                e.metadata.relations.command.name === relationsData.command &&
                e.metadata.relations.slashCommand.name === relationsData.slashCommand.name
        );
        if (!executor) throw new Error("Executor not found");
        return executor as IExecutorModule<O>;
    }

    private async refreshGlobalSlashCommands() {
        if (!this.isReady()) throw new Error("Bot isn't ready yet");
        const globalSlashCommands = this.interactions.commands
            .filter(e => !e.developer)
            .map(e => e.data.toJSON());
        if (!globalSlashCommands.length) {
            return logger.run(`Nothing to register\n`, {
                color: "blue",
                stringBefore: "\n",
                ignore: !getConfig().enable.slashCommandsLogs,
                scope: "Global Slash Commands Refresh"
            });
        }
        logger.run(`Registering...`, {
            color: "blue",
            stringBefore: "\n",
            ignore: !getConfig().enable.slashCommandsLogs,
            scope: "Global Slash Commands Refresh"
        });
        const data = (await this.rest.put(Routes.applicationCommands(this.user.id), {
            body: globalSlashCommands
        })) as RESTPostAPIApplicationCommandsJSONBody[];
        await this.updateGlobalCachedSlashCommandsIds();
        logger.run(`Succesfully registered ${data.length} of them\n`, {
            color: "blue",
            ignore: !getConfig().enable.slashCommandsLogs,
            scope: "Global Slash Commands Refresh"
        });
    }

    private async refreshDeveloperSlashCommands() {
        if (!this.isReady()) throw new Error("Bot isn't ready yet");
        const developerSlashCommands = this.interactions.commands
            .filter(e => e.developer)
            .map(e => e.data.toJSON());
        if (!developerSlashCommands.length) {
            return logger.run(`Nothing to register\n`, {
                color: "blue",
                stringBefore: "\n",
                ignore: !getConfig().enable.slashCommandsLogs,
                scope: "Developer Slash Commands Refresh"
            });
        }
        logger.run(`Registering...`, {
            color: "blue",
            stringBefore: "\n",
            ignore: !getConfig().enable.slashCommandsLogs,
            scope: "Developer Slash Commands Refresh"
        });
        const data = (await this.rest.put(
            Routes.applicationGuildCommands(this.user.id, this.developmentMode.guild.id),
            { body: developerSlashCommands }
        )) as RESTPostAPIApplicationGuildCommandsJSONBody[];
        logger.run(
            `Succesfully registered ${data.length} of them in "${this.developmentMode.guild.name}" (ID: ${this.developmentMode.guild.id})\n`,
            {
                color: "blue",
                ignore: !getConfig().enable.slashCommandsLogs,
                scope: "Developer Slash Commands Refresh"
            }
        );
    }

    public async refreshSlashCommands() {
        await this.refreshGlobalSlashCommands();
        await this.refreshDeveloperSlashCommands();
    }

    public async updateGlobalCachedSlashCommandsIds() {
        const registeredCommands = await this.application?.commands.fetch();
        if (registeredCommands?.size) {
            registeredCommands.forEach(command => {
                const cachedCommand = this.interactions.commands.find(
                    e => e.data.name === command.name
                );
                if (cachedCommand) cachedCommand.id = command.id;
                if (command.options.length) {
                    command.options.forEach(subcommand => {
                        let cachedSubCommand: SlashCommandSubCommand | undefined;
                        switch (subcommand.type) {
                            case ApplicationCommandOptionType.Subcommand:
                                cachedSubCommand = this.interactions.subcommands.find(
                                    e =>
                                        e.data.name === subcommand.name &&
                                        e.parent.command === cachedCommand?.data.name
                                );
                                if (cachedSubCommand && cachedCommand)
                                    cachedSubCommand.id = cachedCommand.id;
                                break;

                            case ApplicationCommandOptionType.SubcommandGroup:
                                subcommand.options?.forEach(groupSubcommand => {
                                    if (
                                        groupSubcommand.type !==
                                        ApplicationCommandOptionType.Subcommand
                                    )
                                        return;
                                    cachedSubCommand = this.interactions.subcommands.find(
                                        e =>
                                            e.data.name === groupSubcommand.name &&
                                            e.parent.command === cachedCommand?.data.name
                                    );
                                    if (cachedSubCommand && cachedCommand)
                                        cachedSubCommand.id = cachedCommand.id;
                                });
                                break;
                        }
                    });
                }
            });
        }
    }
}
