import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import SlashCommand from "../../structures/modules/interactions/SlashCommand";
import subcommand2 from "../subcommands/command2/group/subcommand2";
import subcommand1 from "../subcommands/command2/subcommand1";
import authorizations from "../../authorizations";

const data = new SlashCommandBuilder();
data.addSubcommandGroup(
    new SlashCommandSubcommandGroupBuilder()
        .setName("group")
        .setDescription("Subcommand group")
        .addSubcommand(subcommand2.data)
)
    .addSubcommand(subcommand1.data)
    .setName("command2")
    .setDescription("Command with a subcommand and a subcommand group");

export default new SlashCommand({
    name: "command2",
    data,
    authorization: authorizations.owners.slash,
    async run() {
        // The main function of a command with subcommands is impossible to execute
        // So basically we leave this empty :)
    }
});
