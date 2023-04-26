import { AnySelectMenuInteraction } from "discord.js";
import Bot from "../structures/Bot";
import { getConfig } from "../utils/configuration";

export default async (client: Bot, interaction: AnySelectMenuInteraction) => {

    if (getConfig().developerMode.activated && !getConfig().developerMode.channels.includes(interaction.channelId)) return;
    if (!getConfig().developerMode.activated && getConfig().developerMode.channels.includes(interaction.channelId)) return;

    const menu = client.interactions.menus.find((menu) => {
        return menu.name === interaction.customId ||
        (menu.useIncludes && interaction.customId.includes(menu.name))
    });

    if (menu) menu.run(client, interaction);

}