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

    if (!options.member) return false;
    if (getConfig().developers.includes(options.member.id)) return true;

    if (
        !command.authorized?.users?.length &&
        !command.authorized?.roles?.length &&
        !command.authorized?.guilds?.length
    ) return true;

    if (
        command.authorized?.users &&
        command.authorized.users.includes(options.member.id)
    ) return true;

    if (
        command.authorized?.roles &&
        options.member.roles.cache.some(role => command.authorized?.roles?.includes(role.id))
    ) return true;

    if (
        command.authorized?.guilds &&
        command.authorized.guilds.includes(options.guildId ?? "")
    ) return true;

    return false;

}