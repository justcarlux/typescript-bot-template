import { GuildMember, Message } from "discord.js";
import Bot from "../structures/Bot";
import Command from "../structures/modules/Command";
import logger from "../utils/logger";
import { getConfig } from "../utils/configuration";
import { checkChannelRunnability } from "./util";

interface AllowedToRunOptions {
    member?: GuildMember | null,
    guildId?: string | null
}

export function isAllowedToRun(command: Command, options: AllowedToRunOptions) {

    if (getConfig().developers.includes(options.member?.id ?? "")) return true;

    return (
        (command.authorized?.users ? (
            options.member ? command.authorized.users?.includes(options.member.id) : false
        ) : true) &&
        (command.authorized?.roles ? (
            options.member ? options.member.roles.cache.some(role => command.authorized?.roles?.includes(role.id)) : false
        ) : true)
    ) && (
        (command.authorized?.guilds ? command.authorized.guilds.includes(options.guildId ?? "") : true)
    )

}

export default async (client: Bot, message: Message) => {

    if (!checkChannelRunnability(message.channelId)) return;
    if (message.channel.isDMBased()) return;
    if (message.author.bot) return;

    const args = message.content.split(/ +/g);
    const prefix = getConfig().prefixes.find(prefix => args[0].startsWith(prefix));

    if (!prefix) return;

    const cmd = args[0].slice(prefix.length);
    const command = client.commands.get(cmd) ?? client.commands.find(e => e.aliases.includes(cmd));

    if (!command || !isAllowedToRun(command, { member: message.member, guildId: message.guildId })) return;
    
    logger.run(`${message.author.tag} (ID: ${message.author.id}) executed "${prefix}${command.name}" in #${message.channel.name} (ID: ${message.channel.id}) from the guild "${message.guild?.name}" (ID: ${message.guild?.id})`, {
        color: "cyan", ignore: !getConfig().enable.commandsLogs, category: "Commands"
    });

    return await command.run(client, message, args, cmd);

}