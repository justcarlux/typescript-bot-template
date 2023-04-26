import { AutocompleteInteraction } from "discord.js";
import Bot from "../structures/Bot";
import { getConfig } from "../utils/configuration";

export default async (client: Bot, interaction: AutocompleteInteraction) => {

    if (getConfig().developerMode.activated && !getConfig().developerMode.channels.includes(interaction.channelId)) return;
    if (!getConfig().developerMode.activated && getConfig().developerMode.channels.includes(interaction.channelId)) return;

    if (interaction.user.bot) return;
    
    const autocompletion = client.interactions.autocompletions.find(autocompletionData => {
        return autocompletionData.for.some(data => data.name === interaction.commandName)
    });
    
    if (
        !autocompletion ||
        !autocompletion.for.some(e => e.focusedOption === interaction.options.getFocused(true).name)
    ) return;

    if (interaction.options.getSubcommand(false)) {
        const subAutocompletion = client.interactions.autocompletions.find(autocompletionData => {
            return autocompletionData.for.some(data => {
                return data.name === interaction.commandName && data.subcommand === interaction.options.getSubcommand()
            })
        });
        if (
            !subAutocompletion ||
            !subAutocompletion.for.some(e => e.focusedOption === interaction.options.getFocused(true).name)
        ) return;
        return await subAutocompletion.run(client, interaction);
    }

    return await autocompletion.run(client, interaction);

}