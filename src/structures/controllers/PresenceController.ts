import { PresenceData } from "discord.js";
import { getConfig } from "../../utils/configuration";
import { parseVariables } from "../../utils/json-related";
import logger from "../../utils/logger";
import Bot from "../Bot";

export default class PresenceController {

    private client: Bot;
    public constructor(client: Bot) {
        this.client = client;
    }

    public currentPresenceIndex = -1;
    private intervalId: NodeJS.Timeout | null = null;

    private getRandomIndex() {
        if (!getConfig().presence.list.length) return -1;
        if (getConfig().presence.list.length === 1) return 0;
        let index;
        do {
            index = Math.floor(Math.random() * getConfig().presence.list.length);
        } while (index === this.currentPresenceIndex);
        this.currentPresenceIndex = index;
        return index;
    }

    private change() {
        const index = this.getRandomIndex();
        if (index < 0) return;
        const presence = parseVariables(getConfig().presence.list[index], {
            serverCount: this.client.guilds.cache.size
        }) as PresenceData;
        this.client.user?.setPresence(presence);
        logger.run(`Changed to index ${index}:`, {
            color: "cyan", ignore: !getConfig().enable.presenceLogs, category: "Presence", stringBefore: "\n"
        });
        logger.run(`${JSON.stringify(presence)}\n`, {
            color: "cyan", ignore: !getConfig().enable.presenceLogs, category: "Presence"
        });
    }

    public start() {
        if (!getConfig().enable.presence) return;
        this.intervalId = setInterval(() => this.change(), getConfig().presence.interval);
        this.change();
    }

    public stop() {
        if (this.intervalId) clearInterval(this.intervalId);
    }

}