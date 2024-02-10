import ClientEvent from "../../structures/modules/events/ClientEvent";
import { getConfig } from "../../utils/configuration";

export default new ClientEvent({
    name: "guildCreate",
    async run(client, guild) {
        if (!getConfig().enable.refreshSlashCommandsOnNewGuild) return;
        client.refreshSlashCommands();
    }
})