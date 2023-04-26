import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../structures/SlashCommand";

const data = new SlashCommandBuilder()
.addStringOption(option =>
    option
    .setName("option")
    .setDescription("Option that has autocompletion")
    .setAutocomplete(true)
    .setRequired(true)    
)
.setName("command3")
.setDescription("Command with autocompletion")

export default new SlashCommand({
    data,
    async run(client, interaction) {
        return await interaction.reply({
            content: `You selected: ${interaction.options.get("option", true).value}`
        })
    },
})