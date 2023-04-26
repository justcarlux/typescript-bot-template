import * as dotenv from "dotenv";
dotenv.config();

import Bot from "./structures/Bot";
const bot = new Bot();

import * as configuration from "./utils/configuration";
import exceptionCatchers from "./utils/exception-catchers";

(async () => {

    await configuration.load();
    exceptionCatchers();

    console.log(configuration.getConfig().developerMode.activated ? `Starting in Developer Mode...` : `Starting...`);

    await bot.load({ logging: true });
    await bot.start();

})();

export default bot;