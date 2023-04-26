import { AnySelectMenuInteraction } from "discord.js";
import Bot from "./Bot";

interface MenuData {
    name: string, // Name or identifier for the Menu
    useIncludes?: boolean, // If interactions of menu item presses that include this name and are not exactly equal are going to be responded anyways
    run: (client: Bot, interaction: AnySelectMenuInteraction) => void // Run function
}

export default class Menu implements MenuData {

    public name;
    public run;
    public useIncludes;

    constructor (data: MenuData) {
        this.name = data.name;
        this.run = data.run;
        this.useIncludes = data.useIncludes || false;
    }

}