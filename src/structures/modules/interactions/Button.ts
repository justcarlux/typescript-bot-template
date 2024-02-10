import { ButtonInteraction } from "discord.js";
import Bot from "../../Bot";

export interface ButtonData {
    /** Name or identifier for the Button */
    name: string,
    /** If interactions of Button presses that include this name and are not exactly equal are going to be responded anyways */
    useIncludes?: boolean,
    /** Run function */
    run: (client: Bot, interaction: ButtonInteraction) => void
}

export default class Button implements ButtonData {

    public name;
    public run;
    public useIncludes;

    constructor (data: ButtonData) {
        this.name = data.name;
        this.run = data.run;
        this.useIncludes = data.useIncludes ?? false;
    }

}