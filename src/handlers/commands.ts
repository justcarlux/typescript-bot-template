import { Message } from "discord.js";
import Bot from "../structures/Bot";
import Command from "../structures/Command";
import { getConfig } from "../utils/configuration";

const allowedToRun = (command: Command, message: Message): boolean => {

    if (getConfig().developers.includes(message.author.id)) return true;
    if (command.developersOnly) return false;

    if (command.public) return true;

    return false;

}

export default async (client: Bot, message: Message) => {

    if (getConfig().developerMode.activated && !getConfig().developerMode.channels.includes(message.channelId)) return;
    if (!getConfig().developerMode.activated && getConfig().developerMode.channels.includes(message.channelId)) return;
    
    if (message.channel.isDMBased()) return;
    if (message.author.bot) return;

    const args = message.content.split(/ +/g);
    const prefix = getConfig().prefixes.find(prefix => args[0].startsWith(prefix));

    if (!prefix) return;

    const cmd = args[0].slice(prefix.length);
    const command = client.commands.get(cmd) ?? client.commands.find(e => e.alias.includes(cmd));

    if (!command || !allowedToRun(command, message)) return;

    return await command.run(client, message, args);

}