import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Button from "../../structures/modules/interactions/Button";

export default new Button({
    name: "modal",
    async run(client, interaction) {

        const modal = new ModalBuilder()
        .setTitle("Modal")
        .setCustomId("modal")
        
        const input = new TextInputBuilder()
        .setCustomId("input")
        .setLabel("Test input:")
        .setStyle(TextInputStyle.Short)

        const row = new ActionRowBuilder()
        .addComponents(input)
        
        modal.addComponents(row as any);

        await interaction.showModal(modal);

    },
})