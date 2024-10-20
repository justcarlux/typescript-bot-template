import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder
} from "discord.js";
import authorizations from "../../authorizations";
import SlashCommand from "../../structures/modules/interactions/SlashCommand";

const data = new SlashCommandBuilder();
data.setName("command1").setDescription("Command with a normal response");

export default new SlashCommand({
    name: "command1",
    data,
    authorization: authorizations.owners.slash,
    async run(_, interaction) {
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

        return await interaction.reply({
            content: `Test command`,
            embeds: [embed],
            components: [row1, row2, row3]
        });
    }
});
