import { Message, MessagePayload, MessageReplyOptions } from "discord.js";

type CommandAuthorization = (context: Message) =>
{
    authorized: boolean,
    /**
     * This payload will be sent when `authorized` is false. If you leave it empty, the command will not answer with anything
     */
    payload?: MessagePayload | MessageReplyOptions
};

export default CommandAuthorization;