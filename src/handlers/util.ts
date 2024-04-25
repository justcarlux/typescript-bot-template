import { Channel } from "discord.js";
import bot from "..";

export function checkChannelRunnability(channel: string | Channel | null): boolean {
    const channelId = typeof channel === "string" ? channel : channel?.id;
    return (
        (bot.developmentMode.enabled && bot.developmentMode.channels.some(e => e.id === channelId)) ||
        (!bot.developmentMode.enabled && !bot.developmentMode.channels.some(e => e.id === channelId))
    )
}