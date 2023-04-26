import { ButtonInteraction } from "discord.js";
import Bot from "../structures/Bot";
import { getConfig } from "../utils/configuration";

export default async (client: Bot, interaction: ButtonInteraction) => {

    if (getConfig().developerMode.activated && !getConfig().developerMode.channels.includes(interaction.channelId)) return;
    if (!getConfig().developerMode.activated && getConfig().developerMode.channels.includes(interaction.channelId)) return;
    
    const button = client.interactions.buttons.find((button) => {
        return button.name === interaction.customId ||
        (button.useIncludes && interaction.customId.includes(button.name))
    });

    if (button) button.run(client, interaction);

}