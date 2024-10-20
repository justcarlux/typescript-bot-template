import { AnySelectMenuInteraction } from "discord.js";
import Bot from "../structures/Bot";
import { getConfig } from "../utils/configuration";
import logger from "../utils/logger";
import { checkChannelRunnability } from "./util";

export default async (client: Bot, interaction: AnySelectMenuInteraction) => {
    if (!checkChannelRunnability(interaction.channelId) || interaction.user.bot) return;

    const menu = client.interactions.menus.find(menu => {
        return (
            menu.name === interaction.customId ||
            (menu.useIncludes && interaction.customId.includes(menu.name))
        );
    });

    if (!menu) return;

    if (interaction.channel && !interaction.channel.isDMBased()) {
        logger.run(
            `${interaction.user.tag} (ID: ${interaction.user.id}) clicked on the menu with the name of "${menu.name}" in #${interaction.channel?.name} (ID: ${interaction.channel?.id}) from the guild "${interaction.guild?.name}" (ID: ${interaction.guild?.id})`,
            {
                color: "cyan",
                ignore: !getConfig().enable.menuInteractionLogs,
                scope: "Menu Interactions"
            }
        );
    }
    return await menu.run(client, interaction);
};
