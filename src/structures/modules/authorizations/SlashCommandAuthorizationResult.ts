import { InteractionReplyOptions, MessagePayload } from "discord.js";
import IAuthorizationResult from "./IAuthorizationResult";

type SlashCommandAuthorizationResult = IAuthorizationResult<
    InteractionReplyOptions | MessagePayload
>;
export default SlashCommandAuthorizationResult;
