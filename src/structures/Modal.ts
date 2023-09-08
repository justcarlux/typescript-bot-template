import { ModalSubmitInteraction } from "discord.js";
import Bot from "./Bot";

interface ModalData {
    name: string, // Name or identifier for the Modal
    useIncludes?: boolean, // If interactions of modal submits that include this name and are not exactly equal are going to be responded anyways
    run: (client: Bot, interaction: ModalSubmitInteraction) => void // Run function
}

export default class Modal implements ModalData {

    public name;
    public run;
    public useIncludes;

    constructor (data: ModalData) {
        this.name = data.name;
        this.run = data.run;
        this.useIncludes = data.useIncludes || false;
    }

}