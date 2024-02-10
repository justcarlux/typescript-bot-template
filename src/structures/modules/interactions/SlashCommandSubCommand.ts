import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import Bot from "../../Bot";

export interface SlashCommandSubCommandData {
    /** Custom identifier for the Command to avoid name clashes */
    name?: string,
    /** Parent Command information */
    parent: {
        /** Parent Command where this Subcommand belongs to */
        command: string,
        /** Parent Subcommand group where this Subcommand belongs to */
        group?: string
    },
    /** Slash Command Subcommand Data */
    data: SlashCommandSubcommandBuilder,
    /** Run function */
    run: (client: Bot, interaction: ChatInputCommandInteraction) => void
}

export default class SlashCommandSubCommand implements SlashCommandSubCommandData {

    public name;
    public data;
    public run;
    public parent;
    private _id = "";

    constructor (data: SlashCommandSubCommandData) {
        this.name = data.name;
        this.parent = data.parent;
        this.data = data.data;
        this.parent = data.parent;
        this.run = data.run;
    }

    public get id() {
        return this._id;
    }
    
    public set id(x: string) {
        this._id = x;
    }

    public toString() {
        return this._id ?
        `</${this.parent.command || ""}${this.parent.group ? ` ${this.parent.group}` : ""} ${this.data.name || ""}:${this._id}>` :
        `/${this.parent.command || ""}${this.parent.group ? ` ${this.parent.group}` : ""} ${this.data.name || ""}`;
    }
    
}
