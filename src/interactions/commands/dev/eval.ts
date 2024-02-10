import { EmbedBuilder, SlashCommandBuilder, SlashCommandSubcommandBuilder, codeBlock, escapeMarkdown } from "discord.js";
import SlashCommandSubCommand from "../../../structures/modules/interactions/SlashCommandSubCommand";
import { getConfig } from "../../../utils/configuration";
import logger from "../../../utils/logger";
import { stringifyAny } from "../../../utils/string-related";
import SlashCommand from "../../../structures/modules/interactions/SlashCommand";

const data = new SlashCommandBuilder()
.addStringOption(option => 
    option
    .setName("code")
    .setDescription("JavaScript code to evaluate")
    .setRequired(true)
)
.addBooleanOption(option => 
    option
    .setName("ephemeral")
    .setDescription("Reply to this command with an ephemeral message")
    .setRequired(false)
)
.setName("eval")
.setDescription("Evaluate code")

export default new SlashCommand({
    data,
    developerOnly: true,
    async run(client, interaction) {

        const code = interaction.options.getString("code", true).trim();
        const ephemeral = interaction.options.getBoolean("ephemeral", false) ?? false;
        await interaction.deferReply({ ephemeral });

        let result;
        try {
            result = eval(code);
        } catch (err: any) {
            return await interaction.editReply({
                content: `Error:\n\n**${escapeMarkdown(err?.stack ?? err)}**`
            });
        }

        const readableResult = stringifyAny(result);
        const resultCodeBlock = codeBlock("js", readableResult ? readableResult.replaceAll(client.token || "", "<token>") : " ") as string;

        const embed = new EmbedBuilder()
        .setFields([
            {
                name: "Result:",
                value: resultCodeBlock.length > 1024 ? codeBlock("The result is way too long.\nLogged on the console.") : resultCodeBlock
            },
            {
                name: "Datatype:",
                value: codeBlock("js", typeof result)
            }
        ])

        if (readableResult.length > 1024) {
            logger.run(`Result\n${readableResult}\n`, {
                color: "blue", stringBefore: "\n", category: "Eval"
            });
        }

        return await interaction.editReply({ embeds: [embed] });

    }
})
