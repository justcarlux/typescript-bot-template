import { ChatInputCommandInteraction } from "discord.js";
import Bot from "../structures/Bot";
import logger from "../utils/logger";
import { getConfig } from "../utils/configuration";
import { checkChannelRunnability } from "./util";

export default async (client: Bot, interaction: ChatInputCommandInteraction) => {

    if (!checkChannelRunnability(interaction.channelId)) return;
    if (interaction.user.bot) return;

    const command = client.interactions.commands.get(interaction.commandName);
    if (!command) return;
    if (interaction.channel?.isDMBased() || !interaction.guild) return;
    if (command.developerOnly && !client.developers.some(e => e.id === interaction.user.id)) return;

    if (interaction.options.getSubcommand(false)) {

        const group = interaction.options.getSubcommandGroup(false);
        const subCommand = client.interactions.subcommands.find(subcmd => 
            subcmd.parent.command === command.data.name &&
            subcmd.data.name === interaction.options.getSubcommand() &&
            (group ? subcmd.parent.group === group : true)
        );
        if (!subCommand) return;
        if (interaction.channel && !interaction.channel.isDMBased()) {
            logger.run(`${interaction.user.tag} (ID: ${interaction.user.id}) executed "/${command.data.name}${group ? ` ${group}` : ""} ${subCommand.data.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`, {
                color: "cyan", category: "Slash Commands", ignore: !getConfig().enable.slashCommandsLogs,
            });
        }
        return subCommand.run(client, interaction);

    }

    if (interaction.channel && !interaction.channel.isDMBased()) {
        logger.run(`${interaction.user.tag} (ID: ${interaction.user.id}) executed "/${command.data.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`, {
            color: "cyan", category: "Slash Commands", ignore: !getConfig().enable.slashCommandsLogs,
        });
    }

    return await command.run(client, interaction);

}