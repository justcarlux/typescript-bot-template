import { AnySelectMenuInteraction } from "discord.js";
import Bot from "../../Bot";

export interface MenuData {
    /** Name or identifier for the Menu */
    name: string;
    /** If interactions of menu item presses that include this name and are not exactly equal are going to be responded anyways */
    useIncludes?: boolean;
    /** Run function */
    run: (client: Bot, interaction: AnySelectMenuInteraction) => void;
}

export default class Menu implements MenuData {
    public name;
    public run;
    public useIncludes;

    constructor(data: MenuData) {
        this.name = data.name;
        this.run = data.run;
        this.useIncludes = data.useIncludes ?? false;
    }
}
