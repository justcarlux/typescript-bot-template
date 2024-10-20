import { ChatInputCommandInteraction } from "discord.js";
import SlashCommandAuthorizationResult from "./SlashCommandAuthorizationResult";

type SlashCommandAuthorization = (
    context: ChatInputCommandInteraction
) => Promise<SlashCommandAuthorizationResult>;

export default SlashCommandAuthorization;
