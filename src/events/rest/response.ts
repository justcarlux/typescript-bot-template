import RestEvent from "../../structures/modules/events/RestEvent";
import { getConfig } from "../../utils/configuration";
import logger from "../../utils/logger";
import { cut } from "../../utils/string-related";

export default new RestEvent({
    name: "response",
    run(client, request, response) {
        logger.run(`${request.method} ${request.path} ➡ Body: ${cut(JSON.stringify(request.data ?? {}), 200)} ➡ Status code: ${response.statusCode} - Retries: ${request.retries}`, {
            color: "cyan", ignore: !getConfig().enable.discordApiLogging, category: "Discord API"
        });
        logger.run(`Response: ${cut(JSON.stringify(response.body ?? {}), 200)}`, {
            color: "cyan", ignore: !getConfig().enable.discordApiLogging, category: "Discord API"
        });
    },
})