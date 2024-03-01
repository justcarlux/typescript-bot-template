import { Message } from "discord.js";
import Bot from "../structures/Bot";
import { getConfig } from "../utils/configuration";
import logger from "../utils/logger";
import { checkChannelRunnability, isAllowedToRun } from "./util";

export default async (client: Bot, message: Message) => {

    if (!checkChannelRunnability(message.channelId)) return;
    if (message.channel.isDMBased()) return;
    if (message.author.bot) return;

    const args = message.content.split(/ +/g);
    const prefix = getConfig().prefixes.find(prefix => args[0].startsWith(prefix));

    if (!prefix) return;

    const cmd = (args.shift() as string).slice(prefix.length);
    const command = client.commands.get(cmd) ?? client.commands.find(e => e.aliases.includes(cmd));

    if (!command || !isAllowedToRun(command, { member: message.member, guildId: message.guildId })) return;
    
    logger.run(`${message.author.tag} (ID: ${message.author.id}) executed "${prefix}${command.name}" in #${message.channel.name} (ID: ${message.channel.id}) from the guild "${message.guild?.name}" (ID: ${message.guild?.id})`, {
        color: "cyan", ignore: !getConfig().enable.commandsLogs, category: "Commands"
    });

    return await command.run(client, message, args, cmd, prefix);

}