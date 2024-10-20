import {
    BaseMessageOptions,
    GuildTextBasedChannel,
    Message,
    MessagePayload
} from "discord.js";
import ExecutorOrigin from "../structures/modules/executors/ExecutorOrigin";

export async function deferOrigin(origin: ExecutorOrigin, ephemeral?: boolean) {
    if (origin instanceof Message)
        return await (origin.channel as GuildTextBasedChannel).sendTyping();
    return await origin.deferReply({ ephemeral: ephemeral ?? false });
}

export async function replyDeferredOrigin(
    origin: ExecutorOrigin,
    payload: BaseMessageOptions | MessagePayload
) {
    if (origin instanceof Message) return await origin.reply(payload);
    return await origin.editReply(payload);
}
