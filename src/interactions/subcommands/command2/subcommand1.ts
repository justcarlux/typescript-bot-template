import { SlashCommandSubcommandBuilder } from "discord.js";
import SlashCommandSubCommand from "../../../structures/modules/interactions/SlashCommandSubCommand";

const data = new SlashCommandSubcommandBuilder()
.setName("subcommand1")
.setDescription("Subcommand of a command")

export default new SlashCommandSubCommand({
    data,
    parent: {
        command: "command2"
    },
    async run(client, interaction) {
        return await interaction.reply({
            content: "Subcommand",
            ephemeral: true
        })
    },
})