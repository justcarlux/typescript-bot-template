import { ModalSubmitInteraction } from "discord.js";
import Bot from "../structures/Bot";
import { getConfig } from "../utils/configuration";

export default async (client: Bot, interaction: ModalSubmitInteraction) => {

    if (getConfig().developerMode.activated && !getConfig().developerMode.channels.includes(interaction.channelId || "")) return;
    if (!getConfig().developerMode.activated && getConfig().developerMode.channels.includes(interaction.channelId || "")) return;

    const modal = client.interactions.modals.find((modal) => {
        return modal.name === interaction.customId ||
        (modal.useIncludes && interaction.customId.includes(modal.name))
    });

    if (!modal) return;

    return await modal.run(client, interaction);

}