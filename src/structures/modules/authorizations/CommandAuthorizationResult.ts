import { MessagePayload, MessageReplyOptions } from "discord.js";
import IAuthorizationResult from "./IAuthorizationResult";

type CommandAuthorizationResult = IAuthorizationResult<
    MessagePayload | MessageReplyOptions
>;
export default CommandAuthorizationResult;
