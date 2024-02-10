import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../structures/modules/interactions/SlashCommand";

const data = new SlashCommandBuilder()
.setName("refreshslashcommands")
.setDescription("Refresh all Slash Commands")

export default new SlashCommand({
    data,
    developerOnly: true,
    async run(client, interaction) {

        await interaction.deferReply();
        await client.refreshSlashCommands();
        return await interaction.editReply({ content: "Slash Commands refreshed!" });

    }
})
