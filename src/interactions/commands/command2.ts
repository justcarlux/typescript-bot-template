import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import SlashCommand from "../../structures/modules/interactions/SlashCommand";
import subcommand2 from "../subcommands/command2/group/subcommand2";
import subcommand1 from "../subcommands/command2/subcommand1";

const data = new SlashCommandBuilder()
.addSubcommandGroup(
    new SlashCommandSubcommandGroupBuilder()
    .setName("group")
    .setDescription("Subcommand group")
    .addSubcommand(subcommand2.data)
)
.addSubcommand(subcommand1.data)
.setName("command2")
.setDescription("Command with a subcommand and a subcommand group")

export default new SlashCommand({
    data,
    async run(client, interaction) {
        // The main function of a command with subcommands is impossible to execute
        // So basically we leave this empty :)
    },
})