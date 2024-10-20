import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../structures/modules/interactions/SlashCommand";
import authorizations from "../../../authorizations";

const data = new SlashCommandBuilder();
data.setName("refreshslashcommands").setDescription("Refresh all Slash Commands");

export default new SlashCommand({
    name: "refreshslashcommands",
    data,
    developer: true,
    authorization: authorizations.owners.slash,
    async run(client, interaction) {
        await interaction.deferReply();
        await client.refreshSlashCommands();
        return await interaction.editReply({ content: "Slash Commands refreshed!" });
    }
});
