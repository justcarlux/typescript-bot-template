import { ApplicationCommandOptionType, Client, ClientEvents, Collection, GatewayIntentBits, Guild, GuildBasedChannel, Partials, RESTPostAPIApplicationCommandsJSONBody, RESTPostAPIApplicationGuildCommandsJSONBody, RestEvents, Routes, User } from "discord.js";
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
import PresenceController from "./controllers/PresenceController";

export default class Bot extends Client {

    public commands = new Collection<string, Command>();
    public interactions = {
        commands: new Collection<string, SlashCommand>(),
        subcommands: new Collection<string, SlashCommandSubCommand>(),
        autocompletions: new Collection<string, Autocompletion>(),
        buttons: new Collection<string, Button>(),
        menus: new Collection<string, Menu>(),
        modals: new Collection<string, Modal>()
    }
    public events: (ClientEvent<keyof ClientEvents> | RestEvent<keyof RestEvents>)[] = [];
    public owners: User[] = [];
    public createdAt;
    public startedAt: number = 0;
    public developmentMode!: { guild: Guild, channels: GuildBasedChannel[], enabled: boolean };
    public controllers = {
        presence: new PresenceController(this)
    }

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
                GatewayIntentBits.DirectMessages,
            ],
            partials: [Partials.Message, Partials.Reaction, Partials.Channel],
            allowedMentions: { repliedUser: false, parse: ['users'] },
        });
        if (!process.env.BOT_TOKEN?.trim()) {
            logger.run(`BOT_TOKEN is not specified in the .env file`, {
                color: "red", category: "Fatal"
            });
            process.exit();
        }
        this.createdAt = Date.now();
        this.rest.setToken(process.env.BOT_TOKEN);
    }

    public async load() {

        this.removeAllListeners();
        this.rest.removeAllListeners();
        
        this.commands = await this.loadModules<Command>("commands");
        logger.run(`Loaded commands: ${this.commands.map(e => e.name).join(", ") || "None"}`, {
            color: "blue", stringBefore: "\n", category: "Bot"
        });

        this.interactions.commands = await this.loadModules<SlashCommand>("interactions/commands");
        logger.run(`Loaded slash commands: ${this.interactions.commands.map(e => e.data.name).join(", ") || "None"}`, {
            color: "blue", category: "Bot"
        });

        this.interactions.subcommands = await this.loadModules<SlashCommandSubCommand>("interactions/subcommands");
        logger.run(`Loaded slash commands subcommands: ${this.interactions.subcommands.map(e => `${e.parent.command}${e.parent.group ? `/${e.parent.group}`: ""}/${e.data.name}`).join(", ") || "None"}`, {
            color: "blue", category: "Bot"
        });

        this.interactions.autocompletions = await this.loadModules<Autocompletion>("interactions/autocompletions");
        logger.run(`Loaded slash commands autocompletions: ${this.interactions.autocompletions.map(e => e.name).join(", ") || "None"}`, {
            color: "blue", category: "Bot"
        });

        this.interactions.buttons = await this.loadModules<Button>("interactions/buttons");
        logger.run(`Loaded button interactions: ${this.interactions.buttons.map(e => e.name).join(", ") || "None"}`, {
            color: "blue", category: "Bot"
        });

        this.interactions.menus = await this.loadModules<Menu>("interactions/menus");
        logger.run(`Loaded menu interactions: ${this.interactions.menus.map(e => e.name).join(", ") || "None"}`, {
            color: "blue", category: "Bot"
        });

        this.interactions.modals = await this.loadModules<Modal>("interactions/modals");
        logger.run(`Loaded modal interactions: ${this.interactions.modals.map(e => e.name).join(", ") || "None"}`, {
            color: "blue", category: "Bot"
        });

        this.events = await this.loadEvents();
        logger.run(`Loaded client events: ${this.events.filter(e => e instanceof ClientEvent).map(e => e.name).join(", ") || "None"}`, {
            color: "blue", category: "Bot"
        });
        logger.run(`Loaded Discord API REST events: ${this.events.filter(e => e instanceof RestEvent).map(e => e.name).join(", ") || "None"}`, {
            color: "blue", category: "Bot"
        });

        await this.loadOwners();        
        await this.loadDeveloperModeData();

    }

    public async start() {
        this.login(process.env.BOT_TOKEN)
            .then(async () => {
                this.startedAt = Date.now();
            })
            .catch(err => {
                logger.run(`Error while starting the client:\n${err.stack ? err.stack : err}`, {
                    color: "red", category: "Fatal"
                });
                process.exit();
            });
    }

    private async loadModules<ModuleType extends Command | SlashCommand | SlashCommandSubCommand | Autocompletion | Button | Menu | Modal>(
        where: "commands" |
            "interactions/commands" |
            "interactions/subcommands" |
            "interactions/autocompletions" |
            "interactions/buttons" |
            "interactions/menus" |
            "interactions/modals"
    ): Promise<Collection<string, ModuleType>> {

        const collection = new Collection<string, ModuleType>();

        let elements;
        try {
            elements = (await directoryWalker(path.join(require.main?.path || "", where)))
            .filter(e => e.path.endsWith(".ts") || e.path.endsWith(".js"));
        } catch (err) {
            return collection;
        }

        for (const index in elements) {
            const element = elements[index];
            if (element.data.isDirectory()) continue;
            uncacheModule(element.path);
            const module = (await import(element.path)).default as ModuleType;
            collection.set((module as any).name ? (module as any).name as string : (module as any).data.name as string, module);
        }

        return collection;

    }

    private async loadEvents() {

        const events: (ClientEvent<keyof ClientEvents> | RestEvent<keyof RestEvents>)[] = [];
        
        let files: DirectoryWalkerEntry[] = [];
        try {
            files = (await directoryWalker(path.join(require.main?.path || "", `events`)))
            .filter(e => e.path.endsWith(".ts") || e.path.endsWith(".js"));
        } catch (err) { return events; }

        for (const index in files) {

            const file = files[index];
            if (file.data.isDirectory()) continue;

            uncacheModule(file.path);
            const event: (ClientEvent<keyof ClientEvents> | RestEvent<keyof RestEvents>) = (await import(file.path)).default;
            events.push(event);

            if (event instanceof ClientEvent) {
                if (event.once) {
                    this.once(event.name, (...args) => {
                        if (event.name !== "ready" && !this.loaded) return;
                        event.run.apply(null, [this, ...args])
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
                    this.rest.once(event.name, (...args) => {
                        if (!this.loaded) return;
                        event.run.apply(null, [this, ...args]);
                    });
                } else {
                    this.rest.on(event.name, (...args) => {
                        if (!this.loaded) return;
                        event.run.apply(null, [this, ...args]);
                    });
                }
            }

        }

        return events;

    }

    private async loadOwners() {

        const owners = (await Promise.all(
            getConfig().owners.map(async (id) => {
                let user: User | null = null;
                try {
                    user = await this.users.fetch(id);
                } catch (err) {}
                return user;
            })
        )).filter((e) => e) as User[];

        const missingOwners = getConfig().owners.filter(e => !owners.some(u => u.id === e));
        if (missingOwners.length) {
            logger.run(
                `The following owner user IDs were not found: ${missingOwners.join(", ")}`,
                { color: "red", category: "Fatal" }
            );
            logger.run(
                `Check your config.ts file and make sure you haven't specified any invalid IDs`,
                { color: "red", category: "Fatal" }
            );
            process.exit();
        }

        this.owners = owners;

        logger.run(`Loaded owners: ${this.owners.map(e => `${e.tag} (ID: ${e.id})`).join(", ") || "None"}`, {
            color: "blue", category: "Bot"
        });

    }

    private async loadDeveloperModeData() {

        let guild: Guild;
        try {
            guild = await this.guilds.fetch(getConfig().developmentMode.guild.id);
            if (!guild) throw new Error();
        } catch (err) {
            logger.run(`Development guild ID not found: ${getConfig().developmentMode.guild.id}`, { color: "red", category: "Fatal" });
            logger.run(
                `Check your config.ts file and make sure you haven't specified any invalid IDs`,
                { color: "red", category: "Fatal" }
            );
            process.exit();
        }

        const channels = (await Promise.all(
            getConfig().developmentMode.channels.map(async (id) => {
                let channel: GuildBasedChannel | null = null;
                try {
                    channel = await guild.channels.fetch(id);
                } catch (err) {}
                return channel;
            })
        )).filter((e) => e) as GuildBasedChannel[];

        const missingChannels = getConfig().developmentMode.channels.filter(e => !channels.some(c => c.id === e));
        if (missingChannels.length) {
            logger.run(
                `The following developer channel IDs were not found in "${guild.name}" (ID: ${guild.id}): ${missingChannels.join(", ")}`,
                { color: "red", category: "Fatal" }
            );
            logger.run(
                `Check your config.ts file and make sure you haven't specified any invalid IDs`,
                { color: "red", category: "Fatal" }
            );
            process.exit();
        }

        this.developmentMode = { enabled: getConfig().developmentMode.enabled, guild, channels };

        logger.run(`Development guild: ${this.developmentMode.guild.name} (ID: ${this.developmentMode.guild.id})`, { color: "blue", ignore: !getConfig().developmentMode.enabled, category: "Bot", stringBefore: "\n" })
        logger.run(`Development channels:`, { color: "blue", ignore: !getConfig().developmentMode.enabled, category: "Bot" })
        this.developmentMode.channels.forEach(channel => {
            logger.run(`#${channel.name} (ID: ${channel.id})`, { color: "blue", ignore: !getConfig().developmentMode.enabled, category: "Bot" })
        })

    }

    private async refreshGlobalSlashCommands() {
        if (!this.isReady()) throw new Error("Bot isn't ready yet");
        const globalSlashCommands = this.interactions.commands
        .filter(e => !e.developer)
        .map(e => e.data.toJSON());
        if (!globalSlashCommands.length) {
            return logger.run(`Nothing to register\n`, {
                color: "blue", stringBefore: "\n", ignore: !getConfig().enable.slashCommandsLogs, category: "Global Slash Commands Refresh"
            });
        }
        logger.run(`Registering...`, {
            color: "blue", stringBefore: "\n", ignore: !getConfig().enable.slashCommandsLogs, category: "Global Slash Commands Refresh"
        });
        const data = await this.rest.put(Routes.applicationCommands(this.user.id), { body: globalSlashCommands }) as RESTPostAPIApplicationCommandsJSONBody[];
        await this.updateGlobalCachedSlashCommandsIds();
        logger.run(`Succesfully registered ${data.length} of them\n`, {
            color: "blue", ignore: !getConfig().enable.slashCommandsLogs, category: "Global Slash Commands Refresh"
        });
    }

    private async refreshDeveloperSlashCommands() {
        if (!this.isReady()) throw new Error("Bot isn't ready yet");
        const developerSlashCommands = this.interactions.commands
        .filter(e => e.developer)
        .map(e => e.data.toJSON());
        if (!developerSlashCommands.length) {
            return logger.run(`Nothing to register\n`, {
                color: "blue", stringBefore: "\n", ignore: !getConfig().enable.slashCommandsLogs, category: "Developer Slash Commands Refresh"
            });
        }
        logger.run(`Registering...`, {
            color: "blue", stringBefore: "\n", ignore: !getConfig().enable.slashCommandsLogs, category: "Developer Slash Commands Refresh"
        });
        const data = await this.rest.put(Routes.applicationGuildCommands(this.user.id, this.developmentMode.guild.id), { body: developerSlashCommands }) as RESTPostAPIApplicationGuildCommandsJSONBody[];
        logger.run(`Succesfully registered ${data.length} of them in "${this.developmentMode.guild.name}" (ID: ${this.developmentMode.guild.id})\n`, {
            color: "blue", ignore: !getConfig().enable.slashCommandsLogs, category: "Developer Slash Commands Refresh"
        });
    }

    public async refreshSlashCommands() {
        await this.refreshGlobalSlashCommands();
        await this.refreshDeveloperSlashCommands();
    }

    public async updateGlobalCachedSlashCommandsIds() {
        const registeredCommands = await this.application?.commands.fetch();
        if (registeredCommands?.size) {
            registeredCommands.forEach(command => {
                const cachedCommand = this.interactions.commands.find(e => e.data.name === command.name);
                if (cachedCommand) cachedCommand.id = command.id;
                if (command.options.length) {
                    command.options.forEach(subcommand => {
                        let cachedSubCommand: SlashCommandSubCommand | undefined;
                        switch (subcommand.type) {
                            case ApplicationCommandOptionType.Subcommand:
                                cachedSubCommand = this.interactions.subcommands.find(e => e.data.name === subcommand.name && e.parent.command === cachedCommand?.data.name);
                                if (cachedSubCommand && cachedCommand) cachedSubCommand.id = cachedCommand.id;
                                break;
                        
                            case ApplicationCommandOptionType.SubcommandGroup:
                                subcommand.options?.forEach(groupSubcommand => {
                                    if (groupSubcommand.type !== ApplicationCommandOptionType.Subcommand) return;
                                    cachedSubCommand = this.interactions.subcommands.find(e => e.data.name === groupSubcommand.name && e.parent.command === cachedCommand?.data.name);
                                    if (cachedSubCommand && cachedCommand) cachedSubCommand.id = cachedCommand.id;
                                });
                                break;
                        }
                    });
                }
            });
        }
    }

}