import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../structures/modules/interactions/SlashCommand";
import authorizations from "../../authorizations";
import executor, { metadata } from "../../executors/executorcommand";

const data = new SlashCommandBuilder();
data.setName("executorcommand")
    .setDescription("Command connected with a text command through an executor")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles);

export default new SlashCommand({
    name: "executorcommand",
    data,
    authorization: authorizations.withPermissions.slash(metadata.permissions),
    async run(client, interaction) {
        return await executor(client, { origin: interaction });
    }
});
