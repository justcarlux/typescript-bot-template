import { Message } from "discord.js";
import CommandAuthorizationResult from "./CommandAuthorizationResult";

type CommandAuthorization = (context: Message) => Promise<CommandAuthorizationResult>;

export default CommandAuthorization;
