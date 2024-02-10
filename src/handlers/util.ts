import { Channel } from "diagnostics_channel";
import { TextChannel } from "discord.js";
import bot from "..";

export function checkChannelRunnability(channel: string | Channel | null): boolean {
    const channelId = channel instanceof TextChannel ? channel.id : channel;
    return (
        (bot.developmentMode.enabled && bot.developmentMode.channels.some(e => e.id === channelId)) ||
        (!bot.developmentMode.enabled && !bot.developmentMode.channels.some(e => e.id === channelId))
    )
}