import { Message } from "discord.js";
import { getConfig } from "../../utils/configuration";
import Bot from "../Bot";

export interface CommandData {
    /** Name or identifier for the Command */
    name: string,
    /** Aliases for the Command */
    aliases?: string[],
    /** Authorized requirements in order for this Command to work */
    authorized?: {
        /** Required role IDs */
        roles?: string[],
        /** Required user IDs */
        users?: string[],
        /** Guild IDs where this Command will only work */
        guilds?: string[]
    },
    /** Run function */
    run: (client: Bot, message: Message, args: string[], cmd: string, prefix: string) => void
}

export default class Command implements CommandData {

    public name;
    public aliases;
    public run;
    public authorized;

    constructor (data: CommandData) {
        this.name = data.name;
        this.aliases = data.aliases ?? [];
        this.run = data.run;
        this.authorized = data.authorized;
    }

    public toString(prefix?: string) {
        return (prefix ?? getConfig().prefixes[0]) + (this.name || "");
    }

}