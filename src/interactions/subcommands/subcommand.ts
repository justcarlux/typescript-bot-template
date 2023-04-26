import { SlashCommandSubcommandBuilder } from "discord.js";
import SlashCommandSubCommand from "../../structures/SlashCommandSubCommand";

const data = new SlashCommandSubcommandBuilder()
.setName("subcommand")
.setDescription("Subcommand of a command")

export default new SlashCommandSubCommand({
    data,
    parent: "command2",
    async run(client, interaction) {
        return await interaction.reply({
            content: "Subcommand",
            ephemeral: true
        })
    },
})