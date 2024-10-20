import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    StringSelectMenuBuilder
} from "discord.js";
import Command from "../structures/modules/Command";
import authorizations from "../authorizations";

export default new Command({
    name: "command1",
    authorization: authorizations.owners.text,
    run: async (_, message) => {
        const embed = new EmbedBuilder().setDescription("Example embed").setTimestamp();

        const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("button")
                .setLabel("Button")
                .setStyle(ButtonStyle.Primary)
        );

        const row2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("menu")
                .setPlaceholder("Menu")
                .setOptions([
                    { label: "Option 1", value: "option1" },
                    { label: "Option 2", value: "option2" },
                    { label: "Option 3", value: "option3" }
                ])
        );

        const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("modal")
                .setLabel("Modal")
                .setStyle(ButtonStyle.Primary)
        );

        return await message.reply({
            content: `Test command`,
            embeds: [embed],
            components: [row1, row2, row3]
        });
    }
});
