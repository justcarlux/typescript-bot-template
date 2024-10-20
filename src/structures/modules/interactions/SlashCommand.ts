import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Bot from "../../Bot";
import SlashCommandAuthorization from "../authorizations/SlashCommandAuthorization";

export interface SlashCommandData {
    /** Custom identifier for the Slash Command to avoid name clashes */
    name: string;
    /** Slash Command data */
    data: SlashCommandBuilder;
    /** Authorization check in order for users to be able to run the command */
    authorization?: SlashCommandAuthorization;
    /** If this is a Slash Command that's only going to be registered in development guilds */
    developer?: boolean;
    /** Run function */
    run: (client: Bot, interaction: ChatInputCommandInteraction) => void;
}

export default class SlashCommand implements SlashCommandData {
    public name;
    public data;
    public authorization;
    public developer;
    public run;
    private _id = "";

    constructor(data: SlashCommandData) {
        this.name = data.name;
        this.data = data.data;
        this.developer = data.developer ?? false;
        this.authorization = data.authorization;
        this.run = data.run;
    }

    public get id() {
        return this._id;
    }

    public set id(x: string) {
        this._id = x;
    }

    public toString() {
        return this._id ? `</${this.data.name || ""}:${this._id}>` : `/${this.data.name}`;
    }
}
