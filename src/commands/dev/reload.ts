import Command from "../../structures/Command";
import * as configuration from "../../utils/configuration";

export default new Command({
    name: "reload",
    developersOnly: true,
    run: async (client, message, args) => {

        await message.channel.sendTyping();

        console.log(`\nReloading bot (command sent by ${message.author.tag})...`)

        client.loaded = false;
        await configuration.load();
        await client.load({ logging: true });
        client.loaded = true;

        // Switching the value of 'client.loaded' is done here so the bot doesn't try to do anything while it is reloading

        console.log("Bot reloaded!")

        return await message.reply({ content: "Bot reloaded!" });

    }
})