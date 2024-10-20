import { SlashCommandSubcommandBuilder } from "discord.js";
import SlashCommandSubCommand from "../../../../structures/modules/interactions/SlashCommandSubCommand";

const data = new SlashCommandSubcommandBuilder()
    .setName("subcommand2")
    .setDescription("Subcommand of a subcommand group");

export default new SlashCommandSubCommand({
    name: "subcommand2",
    data,
    parent: {
        group: "group",
        command: "command2"
    },
    async run(_, interaction) {
        return await interaction.reply({
            content: "Subcommand from a subcommand group",
            ephemeral: true
        });
    }
});
