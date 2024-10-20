import { Message } from "discord.js";
import botMentionCommand from "../commands/_bot-mention";
import Bot from "../structures/Bot";
import { getConfig } from "../utils/configuration";
import logger from "../utils/logger";
import { checkChannelRunnability } from "./util";

export default async (client: Bot, message: Message) => {
    if (
        !checkChannelRunnability(message.channelId) ||
        message.channel.isDMBased() ||
        !message.guild ||
        message.author.bot
    )
        return;

    if (botMentionCommand.matcher(client, message)) {
        return await botMentionCommand.executor(client, message);
    }

    const availablePrefixes = [...getConfig().prefixes];
    if (getConfig().allowBotMentionAsPrefix) {
        availablePrefixes.push(`${client.user!.toString()} `);
    }

    const prefixesWithSpaces = availablePrefixes.filter(e => e.includes(" "));
    const prefixesWithoutSpaces = availablePrefixes.filter(e => !e.includes(" "));

    const args = message.content.split(/ +/g);
    let prefix = prefixesWithoutSpaces.find(prefix => args[0].startsWith(prefix));
    let cmd = null;
    if (prefix) {
        cmd = args.shift()!.slice(prefix.length);
    } else if (!prefix) {
        prefix = prefixesWithSpaces.find(prefix => message.content.startsWith(prefix));
        args.shift();
        cmd = args.shift();
    }

    if (!prefix || !cmd) return;

    const command =
        client.commands.get(cmd) ?? client.commands.find(e => e.aliases.includes(cmd));
    if (!command) return;

    if (command.authorization) {
        const authorization = await command.authorization(message);
        if (!authorization.authorized && authorization.payload) {
            return await message.reply(authorization.payload);
        }
    }

    logger.run(
        `${message.author.tag} (ID: ${message.author.id}) executed "${command.name}" in #${message.channel.name} (ID: ${message.channel.id}) from the guild "${message.guild?.name}" (ID: ${message.guild?.id})`,
        {
            color: "cyan",
            ignore: !getConfig().enable.commandsLogs,
            scope: "Commands"
        }
    );

    const timestamp = Date.now();
    await command.run(client, message, args, cmd, prefix);
    logger.run(
        `Execution of "${command.name}" by ${message.author.tag} (ID: ${message.author.id}) in #${message.channel.name} (ID: ${message.channel.id}) from the guild "${message.guild?.name}" (ID: ${message.guild?.id}) took ${((Date.now() - timestamp) / 1000).toFixed(1)}s (${Date.now() - timestamp} ms)`,
        {
            color: "cyan",
            ignore: !getConfig().enable.commandExecutionTimeLogs,
            scope: "Commands"
        }
    );
};
