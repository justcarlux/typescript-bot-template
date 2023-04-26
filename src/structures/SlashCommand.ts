import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Bot from "./Bot";

interface SlashCommandData {
    data: SlashCommandBuilder, // Data for the Slash Command
    run: (client: Bot, interaction: ChatInputCommandInteraction) => void // Run function
}

export default class SlashCommand implements SlashCommandData {

    public data;
    public run;

    constructor (data: SlashCommandData) {
        this.data = data.data;
        this.run = data.run;
    }

}