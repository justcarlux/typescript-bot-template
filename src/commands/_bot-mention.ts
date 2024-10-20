import { Message } from "discord.js";
import Bot from "../structures/Bot";

function matcher(client: Bot, message: Message) {
    return message.content.trim() === client.user?.toString();
}

async function executor(_: Bot, message: Message) {
    return await message.reply({ content: "Bot mentioned!" });
}

export default { matcher, executor };
