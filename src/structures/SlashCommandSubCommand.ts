import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import Bot from "./Bot";

interface SlashCommandSubCommandData {
    parent: string, // Name of the command where this Sub-Command belongs to
    data: SlashCommandSubcommandBuilder, // Data for the Slash Command Sub-Command
    run: (client: Bot, interaction: ChatInputCommandInteraction) => void // Run function
}

export default class SlashCommandSubCommand implements SlashCommandSubCommandData {

    public parent;
    public data;
    public run;

    constructor (data: SlashCommandSubCommandData) {
        this.parent = data.parent;
        this.data = data.data;
        this.run = data.run;
    }

}