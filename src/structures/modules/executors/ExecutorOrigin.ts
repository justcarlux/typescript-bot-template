import { ChatInputCommandInteraction, Message } from "discord.js";

export type ExecutorOrigin = Message | ChatInputCommandInteraction;
export default ExecutorOrigin;
