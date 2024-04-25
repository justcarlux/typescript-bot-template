import { BaseMessageOptions, Message } from "discord.js";
import { getConfig } from "../../utils/configuration";
import Bot from "../Bot";
import CommandAuthorization from "./authorizations/CommandAuthorization";

export interface CommandData {
    /** Name or identifier for the Command */
    name: string,
    /** Aliases for the Command */
    aliases?: string[],
    /** Authorization check in order for users to be able to run the command */
    authorization?: CommandAuthorization,
    /** Run function */
    run: (client: Bot, message: Message, args: string[], cmd: string, prefix: string) => void
}

export default class Command implements CommandData {

    public name;
    public aliases;
    public run;
    public authorization;

    constructor (data: CommandData) {
        this.name = data.name;
        this.aliases = data.aliases ?? [];
        this.run = data.run;
        this.authorization = data.authorization;
    }

    public toString(prefix?: string) {
        return (prefix ?? getConfig().prefixes[0]) + (this.name || "");
    }

}