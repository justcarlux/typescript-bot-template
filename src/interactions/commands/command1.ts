import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../structures/SlashCommand";

const data = new SlashCommandBuilder()
.setName("command1")
.setDescription("Command with normal response")

export default new SlashCommand({
    data,
    async run(client, interaction) {
        return await interaction.reply({
            content: "Test command",
            ephemeral: true
        })
    },
})