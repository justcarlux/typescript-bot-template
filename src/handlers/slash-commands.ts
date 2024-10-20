import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../structures/Bot";
import { getConfig } from "../utils/configuration";
import logger from "../utils/logger";
import { checkChannelRunnability } from "./util";

export default async (client: Bot, interaction: ChatInputCommandInteraction) => {
    if (!checkChannelRunnability(interaction.channelId) || interaction.user.bot) return;

    const command = client.interactions.commands.find(e => {
        return (
            e.name === interaction.commandName || e.data.name === interaction.commandName
        );
    });
    if (!command) return;
    if (command.authorization) {
        const authorization = await command.authorization(interaction);
        if (!authorization.authorized && authorization.payload) {
            return await interaction.reply(authorization.payload);
        }
    }
    if (interaction.channel?.isDMBased() || !interaction.guild) return; // Remove this line if you want to accept slash commands from DMs!

    if (interaction.options.getSubcommand(false)) {
        const group = interaction.options.getSubcommandGroup(false);
        const subCommand = client.interactions.subcommands.find(
            subcmd =>
                subcmd.parent.command === command.data.name &&
                subcmd.data.name === interaction.options.getSubcommand() &&
                (group ? subcmd.parent.group === group : true)
        );
        if (!subCommand) return;
        if (
            !getConfig().owners.includes(interaction.user.id) &&
            subCommand.authorization
        ) {
            const authorization = await subCommand.authorization(interaction);
            if (!authorization.authorized && authorization.payload) {
                return await interaction.reply(authorization.payload);
            }
        }
        if (interaction.channel && !interaction.channel.isDMBased()) {
            logger.run(
                `${interaction.user.tag} (ID: ${interaction.user.id}) executed "/${command.data.name}${group ? ` ${group}` : ""} ${subCommand.data.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`,
                {
                    color: "cyan",
                    scope: "Slash Commands",
                    ignore: !getConfig().enable.slashCommandsLogs
                }
            );
        }
        return subCommand.run(client, interaction);
    }

    if (interaction.channel && !interaction.channel.isDMBased()) {
        logger.run(
            `${interaction.user.tag} (ID: ${interaction.user.id}) executed "/${command.data.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`,
            {
                color: "cyan",
                scope: "Slash Commands",
                ignore: !getConfig().enable.slashCommandsLogs
            }
        );
    }
    const timestamp = Date.now();
    await command.run(client, interaction);
    if (interaction.channel && !interaction.channel.isDMBased()) {
        logger.run(
            `Execution of "/${command.data.name}" by ${interaction.user.tag} (ID: ${interaction.user.id}) in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id}) took ${((Date.now() - timestamp) / 1000).toFixed(1)}s (${Date.now() - timestamp} ms)`,
            {
                color: "cyan",
                scope: "Slash Commands",
                ignore: !getConfig().enable.slashCommandExecutionTimeLogs
            }
        );
    }
};
