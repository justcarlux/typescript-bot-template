import { SlashCommandBuilder } from "discord.js";
import SlashCommand from "../../../structures/modules/interactions/SlashCommand";
import { loadConfig } from "../../../utils/configuration";
import logger from "../../../utils/logger";
import authorizations from "../../../authorizations";

const data = new SlashCommandBuilder().setName("reload").setDescription("Reload bot");

export default new SlashCommand({
    name: "reload",
    data,
    developer: true,
    authorization: authorizations.owners.slash,
    async run(client, interaction) {
        await interaction.deferReply();
        logger.run(`Reloading bot (command sent by ${interaction.user.tag})...`, {
            color: "yellow",
            stringBefore: "\n"
        });

        client.loaded = false;
        loadConfig();
        await client.load();
        client.loaded = true;

        // Switching the value of 'client.loaded' is done here so the bot doesn't try to do anything while it is reloading

        logger.run("Bot reloaded!\n", { color: "green", stringBefore: "\n" });
        return await interaction.editReply({ content: "Bot reloaded!" });
    }
});
