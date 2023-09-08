import { ActionRowBuilder, Client, Collection, EmbedBuilder, GatewayIntentBits, Partials, Routes, User } from "discord.js";
import { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";
import * as path from "node:path";
import { getConfig } from "../utils/configuration";
import uncacheModule from "../utils/uncache-module";
import Autocompletion from "./Autocompletion";
import Button from "./Button";
import Command from "./Command";
import Event from "./Event";
import Menu from "./Menu";
import SlashCommand from "./SlashCommand";
import SlashCommandSubCommand from "./SlashCommandSubCommand";
import Modal from "./Modal";

export interface SimpleMessagePayload {
    content?: string,
    embeds?: EmbedBuilder[],
    components?: ActionRowBuilder[],
    ephemeral?: boolean
}

interface LoadBotOptions {
    logging: boolean
}

class Bot extends Client {

    public commands = new Collection<string, Command>();
    public interactions = {
        commands: new Collection<string, SlashCommand>(),
        subcommands: new Collection<string, SlashCommandSubCommand>(),
        autocompletions: new Collection<string, Autocompletion>(),
        buttons: new Collection<string, Button>(),
        menus: new Collection<string, Menu>(),
        modals: new Collection<string, Modal>()
    }
    public owners: User[] = [];
    public startedAt: number = 0;

    private _loaded: boolean = false;

    get loaded() {
        return this._loaded;
    }

    set loaded(x: boolean) {
        if (x) this.startedAt = Date.now();
        this._loaded = x;
    }

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages
            ],
            partials: [Partials.Message, Partials.Reaction],
            allowedMentions: { repliedUser: false, parse: ['users'] }
        });
        this.rest.setToken(process.env.BOT_TOKEN ?? "")
    }

    async load(options: LoadBotOptions) {

        this.removeAllListeners();

        this.commands = await this.loadModules<Command>("commands");
        this.interactions.commands = await this.loadModules<SlashCommand>("interactions/commands");
        this.interactions.subcommands = await this.loadModules<SlashCommandSubCommand>("interactions/subcommands");
        this.interactions.autocompletions = await this.loadModules<Autocompletion>("interactions/autocompletions");
        this.interactions.buttons = await this.loadModules<Button>("interactions/buttons");
        this.interactions.menus = await this.loadModules<Menu>("interactions/menus");
        this.interactions.modals = await this.loadModules<Modal>("interactions/modals");

        const botEvents = await this.loadEvents("bot");
        const restEvents = await this.loadEvents("rest");

        this.owners = await Promise.all(
            getConfig().developers.map(id => this.users.fetch(id))
        )

        if (options.logging) {
            console.log(`Loaded commands: ${this.commands.map(e => e.name).join(", ") || "None"}`);
            console.log(`Loaded slash commands: ${this.interactions.commands.map(e => e.data.name).join(", ") || "None"}`);
            console.log(`Loaded slash commands subcommands: ${this.interactions.subcommands.map(e => `${e.parent}/${e.data.name}`)}`);
            console.log(`Loaded slash commands autocompletions: ${this.interactions.autocompletions.map(e => e.name).join(", ") || "None"}`);
            console.log(`Loaded button interactions: ${this.interactions.buttons.map(e => e.name).join(", ") || "None"}`);
            console.log(`Loaded menu interactions: ${this.interactions.menus.map(e => e.name).join(", ") || "None"}`);
            console.log(`Loaded modals: ${this.interactions.modals.map(e => e.name).join(", ") || "None"}`);
            console.log(`Loaded events: ${botEvents.map(e => e.name).join(", ") || "None"}`);
            console.log(`Loaded Discord API REST events: ${restEvents.map(e => e.name).join(", ") || "None"}`);
            console.log(`Loaded owners: ${this.owners.map(e => e.tag).join(", ") || "None"}`);
        }
        
    }

    async start() {
        this.login(process.env.BOT_TOKEN)
        .then(() => { this.startedAt = Date.now() })
        .catch(err => {
            console.log(`Error when starting client:\n${err.stack ? err.stack : err}`)
            process.exit();
        });
    }

    public async loadModules<ModuleType extends Command | SlashCommand | SlashCommandSubCommand | Autocompletion | Button | Menu | Modal>(
        where: "commands" |
        "interactions/commands" |
        "interactions/subcommands" |
        "interactions/autocompletions" |
        "interactions/buttons" |
        "interactions/menus" |
        "interactions/modals"
    ): Promise<Collection<string, ModuleType>> {

        let elements: Dirent[] = [];
        const collection = new Collection<any, any>();

        try {
            elements = await readdir(path.join(require.main?.path || "", where), { withFileTypes: true });
        } catch (err) {
            return collection;
        }

        for (const index in elements) {

            const element = elements[index];

            async function loadFile(file?: string) {
                const filePath = path.join(require.main?.path || "", where, element.name, file ?? "");
                uncacheModule(filePath);
                const module = (await import(filePath)).default;
                collection.set(module.name ? module.name : module.data.name, module);
            }

            if (element.isDirectory()) {
                const files = (await readdir(path.join(require.main?.path || "", where, element.name)))
                .filter(e => e.endsWith(".ts") || e.endsWith(".js"));
                for (const index in files) {
                    await loadFile(files[index]);
                }
            } else {
                await loadFile();
            }

        }

        return collection;

    }

    async loadEvents(where: "bot" | "rest") {

        const events: Event[] = [];
        let files: string[] = [];
        try {
            files = (await readdir(path.join(require.main?.path || "", `events`, where)))
            .filter(e => e.endsWith(".ts") || e.endsWith(".js"));
        } catch (err) { return events; }
        
        for (const index in files) {

            const filePath = path.join(require.main?.path || "", `events`, where, files[index]);
            uncacheModule(filePath);
            const event: Event = (await import(filePath)).default;
            events.push(event);

            if (where === "bot") {
                if (event.once) {
                    this.once(event.name, (...args) => event.run.apply(null, [this, ...args]));
                } else {
                    this.on(event.name, (...args) => {
                        if (!this.loaded) return;
                        event.run.apply(null, [this, ...args]);
                    });
                }
            }
            
            if (where === "rest") {
                if (event.once) {
                    this.rest.once(event.name, (...args) => event.run.apply(null, [this, ...args]));
                } else {
                    this.rest.on(event.name, (...args) => event.run.apply(null, [this, ...args]));
                }
            }

        }

        return events;

    }

    async registerSlashCommandsInGuilds(guilds: string[]) {

        if (!this.isReady()) throw new Error("Bot isn't ready yet.");
        if (!guilds.length) return;

        const body = this.interactions.commands.map(e => e.data.toJSON());
        if (!body.length) return;

        for (let index in guilds) {
            const guildId = guilds[index];
            const guild = this.guilds.cache.get(guildId);
            if (!guild) continue;
            await this.rest.put(Routes.applicationGuildCommands(this.user.id, guild.id), { body });
        }

    }

    async unregisterSlashCommandsInGuilds(guilds: string[]) {

        if (!this.isReady()) throw new Error("Bot isn't ready yet.");
        if (!guilds.length) return;

        for (let index in guilds) {
            const guildId = guilds[index];
            const guild = this.guilds.cache.get(guildId);
            if (!guild) continue;
            await this.rest.put(Routes.applicationGuildCommands(this.user.id, guild.id), { body: [] });
        }

    }

    async registerGlobalSlashCommands() {

        if (!this.isReady()) throw new Error("Bot isn't ready yet.");
        const body = this.interactions.commands.map(e => e.data.toJSON());
        if (!body.length) return;
        await this.rest.put(Routes.applicationCommands(this.user.id), { body });

    }

    async unregisterGlobalSlashCommands() {

        if (!this.isReady()) throw new Error("Bot isn't ready yet.");
        await this.rest.put(Routes.applicationCommands(this.user.id), { body: [] });

    }

}

export default Bot;