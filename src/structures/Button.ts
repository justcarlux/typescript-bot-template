import { ButtonInteraction } from "discord.js";
import Bot from "./Bot";

interface ButtonData {
    name: string, // Name or identifier for the Button
    useIncludes?: boolean, // If interactions of button presses that include this name and are not exactly equal are going to be responded anyways
    run: (client: Bot, interaction: ButtonInteraction) => void // Run function
}

export default class Button implements ButtonData {

    public name;
    public run;
    public useIncludes;

    constructor (data: ButtonData) {
        this.name = data.name;
        this.run = data.run;
        this.useIncludes = data.useIncludes || false;
    }

}