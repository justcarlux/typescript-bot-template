import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Bot from "../../Bot";

export interface SlashCommandData {
    /** Custom identifier for the Slash Command to avoid name clashes */
    name?: string,
    /** Slash Command data */
    data: SlashCommandBuilder,
    /** If this is a Slash Command only for developers */
    developerOnly?: boolean,
    /** Run function */
    run: (client: Bot, interaction: ChatInputCommandInteraction) => void
}

export default class SlashCommand implements SlashCommandData {

    public name;
    public data;
    public run;
    public developerOnly;
    private _id = "";

    constructor (data: SlashCommandData) {
        this.name = data.name;
        this.data = data.data;
        this.run = data.run;
        this.developerOnly = data.developerOnly ?? false;
    }

    public get id() {
        return this._id;
    }
    
    public set id(x: string) {
        this._id = x;
    }
    
    public toString() {
        return this._id ? 
        `</${this.data.name || ""}:${this._id}>` :
        `/${this.data.name}`;
    }

}