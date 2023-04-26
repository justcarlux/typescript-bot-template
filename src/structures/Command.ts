import { Message } from "discord.js";
import Bot from "./Bot";

interface CommandData {
    name: string, // Name or identifier for the Command
    alias?: string[], // Aliases for the command
    developersOnly?: boolean, // If the command can only be used by a developer
    public?: boolean, // If anyone can use the command
    run: (client: Bot, message: Message, args: string[]) => void // Run function
}

export default class Command implements CommandData {

    public name;
    public alias;
    public developersOnly;
    public public;
    public run;

    constructor (data: CommandData) {
        this.name = data.name;
        this.alias = data.alias || [];
        this.run = data.run;
        this.developersOnly = data.developersOnly || false;
        this.public = data.public || false;
    }

}