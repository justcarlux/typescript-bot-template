import { ButtonInteraction, Collection } from "discord.js";
import Bot from "../structures/Bot";
import logger from "../utils/logger";
import { getConfig } from "../utils/configuration";

const cooldowns = new Collection<string, number>();

export default async (client: Bot, interaction: ButtonInteraction) => {

    if (!client.developmentMode.checkChannelRunnability(interaction.channelId)) return;
    if (interaction.user.bot) return;
    
    const cooldownExpiration = cooldowns.get(interaction.user.id);
    if (cooldownExpiration && Date.now() < cooldownExpiration) return;

    const button = client.interactions.buttons.find((button) => {
        return button.name === interaction.customId ||
        (button.useIncludes && interaction.customId.includes(button.name))
    });

    if (!button) return;
        
    if (interaction.channel && !interaction.channel.isDMBased()) {
        logger.run(`${interaction.user.tag} (ID: ${interaction.user.id}) clicked on the button with the name of "${button.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`, {
            color: "cyan", ignore: !getConfig().enable.buttonInteractionLogs, category: "Button Interactions"
        });
    }
    cooldowns.set(interaction.user.id, Date.now() + 1_000); // This is for avoiding double interactions
    return await button.run(client, interaction);

}