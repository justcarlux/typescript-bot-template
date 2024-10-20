import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../structures/modules/interactions/SlashCommand";
import authorizations from "../../authorizations";

const data = new SlashCommandBuilder();
data.addStringOption(option =>
    option
        .setName("option")
        .setDescription("Option that has autocompletion")
        .setAutocomplete(true)
        .setRequired(true)
)
    .setName("command3")
    .setDescription("Command with autocompletion");

export default new SlashCommand({
    name: "command3",
    data,
    authorization: authorizations.owners.slash,
    async run(_, interaction) {
        return await interaction.reply({
            content: `You selected: ${interaction.options.get("option", true).value}`
        });
    }
});
