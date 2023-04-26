import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } from "discord.js";
import Command from "../../structures/Command";

export default new Command({
    name: "command",
    public: true,
    run: async (client, message, args) => {

        const embed = new EmbedBuilder()
        .setDescription("Example embed")
        .setTimestamp()

        const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("button")
            .setLabel("Button")
            .setStyle(ButtonStyle.Primary)
        )

        const row2 = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId("menu")
            .setPlaceholder("Menu")
            .setOptions([
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
                { label: "Option 3", value: "option3" },
            ])
        )

        return await message.reply({
            content: `Test command`,
            embeds: [embed],
            components: [row1, row2]
        } as any)

    }
})