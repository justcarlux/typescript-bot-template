import { EmbedBuilder, SlashCommandBuilder, codeBlock } from "discord.js";
import { isPromise } from "util/types";
import SlashCommand from "../../../structures/modules/interactions/SlashCommand";
import logger from "../../../utils/logger";
import { stringifyAny } from "../../../utils/string-related";
import authorizations from "../../../authorizations";

const data = new SlashCommandBuilder();
data.addStringOption(option =>
    option.setName("code").setDescription("JavaScript code to evaluate").setRequired(true)
)
    .addBooleanOption(option =>
        option
            .setName("ephemeral")
            .setDescription("Reply to this command with an ephemeral message")
            .setRequired(false)
    )
    .addBooleanOption(option =>
        option
            .setName("wrap_inside_async_function")
            .setDescription("Wrap the code inside an asyncronous function")
            .setRequired(false)
    )
    .setName("eval")
    .setDescription("Evaluate code");

export default new SlashCommand({
    name: "eval",
    data,
    developer: true,
    authorization: authorizations.owners.slash,
    async run(client, interaction) {
        const code = interaction.options.getString("code", true).trim();
        const ephemeral = interaction.options.getBoolean("ephemeral", false) ?? false;
        const wrapInsideAsyncFunction =
            interaction.options.getBoolean("wrap_inside_async_function", false) ?? false;
        await interaction.deferReply({ ephemeral });

        const lines = code.split("\n");
        let result: any;
        let error = false;
        try {
            result = await eval(
                wrapInsideAsyncFunction
                    ? `(async () => {${lines
                          .map((line, index) => {
                              if (index === lines.length - 1) {
                                  return `return ${line}`;
                              }
                              return line;
                          })
                          .join("\n")}})()`
                    : code
            );
        } catch (err: any) {
            result = err?.toString() ?? err;
            error = true;
        }

        if (isPromise(result)) {
            await new Promise<void>((resolve, reject) => {
                result
                    .then((value: any) => {
                        result = value;
                        resolve();
                    })
                    .catch(reject);
            }).catch(err => {
                result = err?.toString() ?? err;
                error = true;
            });
        }

        const readableResult = stringifyAny(result);
        const resultCodeBlock = codeBlock(
            "js",
            readableResult
                ? readableResult.replaceAll(client.token || "", "<token>")
                : " "
        ) as string;

        const embed = new EmbedBuilder().setFields([
            {
                name: "Result:",
                value:
                    resultCodeBlock.length > 1024
                        ? codeBlock("The result is way too long.\nLogged on the console.")
                        : resultCodeBlock
            },
            {
                name: "Datatype:",
                value: codeBlock("js", error ? "error" : typeof result)
            }
        ]);

        if (readableResult.length > 1024) {
            logger.run(`Result\n${readableResult}\n`, {
                color: "blue",
                stringBefore: "\n",
                scope: "Eval"
            });
        }

        return await interaction.editReply({ embeds: [embed] });
    }
});
