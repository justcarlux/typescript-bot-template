import { getConfig, loadConfig } from "./utils/configuration";
loadConfig();

import * as dotenv from "dotenv";
dotenv.config();

import Bot from "./structures/Bot";
const bot = new Bot();

import "./utils/exception-catchers";
import logger from "./utils/logger";

(async () => {

    logger.run(getConfig().developmentMode.enabled ? `Starting in Developer Mode...` : `Starting...`, {
        color: "green", category: "Bot"
    });

    await bot.load();
    await bot.start();

})();

export default bot;