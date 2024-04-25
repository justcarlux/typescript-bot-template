import { ChatInputCommandInteraction, InteractionReplyOptions, MessagePayload } from "discord.js";

type SlashCommandAuthorization = (context: ChatInputCommandInteraction) =>
{
    authorized: boolean,
    /**
     * This payload will be sent when `authorized` is false. If you leave it empty, the command will not answer with anything
     */
    payload?: InteractionReplyOptions | MessagePayload
};

export default SlashCommandAuthorization;