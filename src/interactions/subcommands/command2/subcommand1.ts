import { SlashCommandSubcommandBuilder } from "discord.js";
import SlashCommandSubCommand from "../../../structures/modules/interactions/SlashCommandSubCommand";

const data = new SlashCommandSubcommandBuilder()
    .setName("subcommand1")
    .setDescription("Subcommand of a command");

export default new SlashCommandSubCommand({
    name: "subcommand1",
    data,
    parent: {
        command: "command2"
    },
    async run(_, interaction) {
        return await interaction.reply({
            content: "Subcommand",
            ephemeral: true
        });
    }
});
