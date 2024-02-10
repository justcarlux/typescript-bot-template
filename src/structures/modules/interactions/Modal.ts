import { ModalSubmitInteraction } from "discord.js";
import Bot from "../../Bot";

export interface ModalData {
    /** Name or identifier for the Modal */
    name: string,
    /** If interactions of Modal submits that include this name and are not exactly equal are going to be responded anyways */
    useIncludes?: boolean,
    /** Run function */
    run: (client: Bot, interaction: ModalSubmitInteraction) => void
}

export default class Modal implements ModalData {

    public name;
    public run;
    public useIncludes;

    constructor (data: ModalData) {
        this.name = data.name;
        this.run = data.run;
        this.useIncludes = data.useIncludes ?? false;
    }

}