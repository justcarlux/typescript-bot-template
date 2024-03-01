import ClientEvent from "../../structures/modules/events/ClientEvent";
import { getConfig } from "../../utils/configuration";
import logger from "../../utils/logger";
import { upperCaseByIndexes } from "../../utils/string-related";
import { IConfiguration } from "../../structures/IConfiguration";

export default new ClientEvent({
    name: "ready",
    once: true,
    run: async (client) => {

        // Place any loading functions here before settings the 'client.loaded' property to true
        // So we guarantee having everything loaded up before the bot starts actually listening to the rest of events :)

        await client.updateGlobalCachedSlashCommandsIds();
        client.loaded = true;

        logger.run(`Environment enabled: ${
            Object.keys(getConfig().enable)
            .filter(key => getConfig().enable[key as keyof IConfiguration["enable"]])
            .map(string => upperCaseByIndexes(string, [0]))
            .join(", ") || "None"
        }`, { color: "blue", stringBefore: "\n", category: "Bot" });

        logger.run(`Environment disabled: ${
            Object.keys(getConfig().enable)
            .filter(key => !getConfig().enable[key as keyof IConfiguration["enable"]])
            .map(string => upperCaseByIndexes(string, [0]))
            .join(", ") || "None"
        }\n`, { color: "blue", category: "Bot" });

        logger.run(`Started succesfully in ${((Date.now() - client.createdAt) / 1000).toFixed(1)}s as: ${client.user?.tag}\n`, {
            color: "green", stringBefore: "\n", category: "Bot"
        });

    }
})