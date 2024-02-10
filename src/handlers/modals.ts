import { ModalSubmitInteraction } from "discord.js";
import Bot from "../structures/Bot";
import logger from "../utils/logger";
import { getConfig } from "../utils/configuration";
import { checkChannelRunnability } from "./util";

export default async (client: Bot, interaction: ModalSubmitInteraction) => {

    if (!checkChannelRunnability(interaction.channelId)) return;
    if (interaction.user.bot) return;
    
    const modal = client.interactions.modals.find((modal) => {
        return modal.name === interaction.customId ||
        (modal.useIncludes && interaction.customId.includes(modal.name))
    });

    if (!modal) return;

    if (interaction.channel && !interaction.channel.isDMBased()) {
        logger.run(`${interaction.user.tag} (ID: ${interaction.user.id}) sent a modal dialog with the name of "${modal.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the server "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`, {
            color: "cyan", ignore: !getConfig().enable.modalInteractionLogs, category: "Menu Interactions"
        });
    }

    return await modal.run(client, interaction);

}