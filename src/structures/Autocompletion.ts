import { AutocompleteInteraction } from "discord.js";
import Bot from "./Bot";

interface AutocompletionData {
    name: string, // Name or identifier for the Autocompletion
    for: {
        name: string, // Name of the command where this Autocompletion will respond
        focusedOption: string, // Option that has to be focused for this Autocompletion to work
        subcommand?: string // Optional subcommand name
    }[],
    run: (client: Bot, interaction: AutocompleteInteraction) => void // Run function
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