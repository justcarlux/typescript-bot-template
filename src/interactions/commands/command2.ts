import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../structures/SlashCommand";
import subcommand from "../subcommands/subcommand";

const data = new SlashCommandBuilder()
.addSubcommand(subcommand.data)
.setName("command2")
.setDescription("Command with subcommand")

export default new SlashCommand({
    data,
    async run(client, interaction) {
        // The main function of a command with subcommands is impossible to execute
        // So basically we leave this empty :)
    },
})