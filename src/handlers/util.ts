import { Channel } from "diagnostics_channel";
import { GuildMember, TextChannel } from "discord.js";
import bot from "..";
import Command from "../structures/modules/Command";
import SlashCommand from "../structures/modules/interactions/SlashCommand";
import SlashCommandSubCommand from "../structures/modules/interactions/SlashCommandSubCommand";
import { getConfig } from "../utils/configuration";

export function checkChannelRunnability(channel: string | Channel | null): boolean {
    const channelId = channel instanceof TextChannel ? channel.id : channel;
    return (
        (bot.developmentMode.enabled && bot.developmentMode.channels.some(e => e.id === channelId)) ||
        (!bot.developmentMode.enabled && !bot.developmentMode.channels.some(e => e.id === channelId))
    )
}

export interface AllowedToRunOptions {
    member?: GuildMember | null,
    guildId?: string | null
}

export function isAllowedToRun(command: Command | SlashCommand | SlashCommandSubCommand, options: AllowedToRunOptions) {

    if (getConfig().developers.includes(options.member?.id ?? "")) return true;

    return (
        (command.authorized?.users ? (
            options.member ? command.authorized.users?.includes(options.member.id) : false
        ) : true) &&
        (command.authorized?.roles ? (
            options.member ? options.member.roles.cache.some(role => command.authorized?.roles?.includes(role.id)) : false
        ) : true)
    ) && (
        (command.authorized?.guilds ? command.authorized.guilds.includes(options.guildId ?? "") : true)
    )

}