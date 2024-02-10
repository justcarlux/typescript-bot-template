import { AutocompleteInteraction } from "discord.js";
import Bot from "../../Bot";

export interface AutocompletionData {
    /** Name or identifier for the Autocompletion */
    name: string,
    /** Specify the commands where this Autocompletion will respond */
    for: {
        /** Name of the command where this Autocompletion will respond */
        name: string,
        /** Option that has to be focused for this Autocompletion to work */
        focusedOption: string,
        /** Optional Subcommand group */
        group?: string,
        /** Optional Subcommand name */
        subcommand?: string
    }[],
    /** Run function */
    run: (client: Bot, interaction: AutocompleteInteraction) => void
}

export default class Autocompletion implements AutocompletionData {

    public name;
    public for;
    public run;

    constructor (data: AutocompletionData) {
        this.name = data.name;
        this.for = data.for;
        this.run = data.run;
    }

}