import { AutocompleteInteraction } from "discord.js";
import Bot from "../structures/Bot";
import logger from "../utils/logger";
import { getConfig } from "../utils/configuration";
import { checkChannelRunnability } from "./util";

export default async (client: Bot, interaction: AutocompleteInteraction) => {
    
    if (!checkChannelRunnability(interaction.channelId)) return;
    if (interaction.user.bot) return;
    
    const autocompletion = client.interactions.autocompletions.find(autocompletionData => {
        return autocompletionData.for.some(data => {
            return data.name === interaction.commandName &&
            data.focusedOption === interaction.options.getFocused(true).name;
        })
    });
    if (!autocompletion) return;

    if (interaction.options.getSubcommand(false)) {
        const group = interaction.options.getSubcommandGroup(false);
        const subAutocompletion = client.interactions.autocompletions.find(autocompletionData => {
            return autocompletionData.for.some(data => {
                return data.name === interaction.commandName &&
                data.subcommand === interaction.options.getSubcommand() &&
                (group ? data.group === group : true) &&
                data.focusedOption === interaction.options.getFocused(true).name
            })
        });
        if (!subAutocompletion) return;
        if (interaction.channel && !interaction.channel.isDMBased()) {
            logger.run(`${interaction.user.tag} (ID: ${interaction.user.id}) requested the autocompleter with the name of "${subAutocompletion.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`, {
                color: "cyan", ignore: !getConfig().enable.slashCommandsAutocompletionLogs, category: "Slash Commands Autocompletions"
            });
        }
        return await subAutocompletion.run(client, interaction);
    }

    if (interaction.channel && !interaction.channel.isDMBased()) {
        logger.run(`${interaction.user.tag} (ID: ${interaction.user.id}) requested the autocompleter with the name of "${autocompletion.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`, {
            color: "cyan", ignore: !getConfig().enable.slashCommandsAutocompletionLogs, category: "Slash Commands Autocompletions"
        });
    }
    return await autocompletion.run(client, interaction);

}