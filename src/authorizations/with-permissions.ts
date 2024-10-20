import {
    Guild,
    GuildMember,
    PermissionsString,
    TextChannel,
    VoiceChannel
} from "discord.js";
import bot from "..";
import permissionCategories from "../resources/permission-categories";
import IAuthorizationWithFunction from "../structures/common/IAuthorizationWithFunction";
import ICategorizedPermissions from "../structures/common/ICategorizedPermissions";
import CommandAuthorizationResult from "../structures/modules/authorizations/CommandAuthorizationResult";
import SlashCommandAuthorizationResult from "../structures/modules/authorizations/SlashCommandAuthorizationResult";
import IExecutorPermissions from "../structures/modules/executors/IExecutorPermissions";

function categorizePermissions(
    permissions: PermissionsString[]
): ICategorizedPermissions {
    const channel = permissions.filter(e => permissionCategories[e] === "text");
    const global = permissions.filter(e => permissionCategories[e] !== "text");
    return { channel, global };
}

async function performCheck({
    botRequired,
    botOptional,
    userRequired,
    userOptional,
    member,
    channel,
    guild
}: {
    botRequired: ICategorizedPermissions;
    botOptional: ICategorizedPermissions;
    userRequired: ICategorizedPermissions;
    userOptional: ICategorizedPermissions;
    member: GuildMember;
    channel: TextChannel | VoiceChannel;
    guild: Guild;
}): Promise<SlashCommandAuthorizationResult> {
    const botChannelPermissions = channel.permissionsFor(bot.user!.id);
    const userChannelPermissions = channel.permissionsFor(member.id);

    const botRequiredChannelMissing = botRequired.channel.filter(permission => {
        return !botChannelPermissions?.has(permission);
    });
    if (botRequiredChannelMissing.length) {
        return {
            authorized: false,
            payload: {
                content: `Bot is missing required channel permissions: ${botRequiredChannelMissing.join(", ")}`,
                ephemeral: true
            }
        };
    }

    if (
        botOptional.channel.length &&
        !botOptional.channel.some(permission => botChannelPermissions?.has(permission))
    ) {
        return {
            authorized: false,
            payload: {
                content: `Bot does not have at least one of these channel permissions: ${botOptional.channel.join(", ")}`,
                ephemeral: true
            }
        };
    }

    const userRequiredChannelMissing = userRequired.channel.filter(permission => {
        return !userChannelPermissions?.has(permission);
    });
    if (userRequiredChannelMissing.length) {
        return {
            authorized: false,
            payload: {
                content: `User is missing required channel permissions: ${userRequiredChannelMissing.join(", ")}`,
                ephemeral: true
            }
        };
    }

    if (
        userOptional.channel.length &&
        !userOptional.channel.some(permission => userChannelPermissions?.has(permission))
    ) {
        return {
            authorized: false,
            payload: {
                content: `User does not have at least one of these channel permissions: ${userOptional.channel.join(", ")}`,
                ephemeral: true
            }
        };
    }

    const botGlobalPermissions = (guild.members.me ?? (await guild.members.fetchMe()))
        .permissions;
    const userGlobalPermissions = member.permissions;

    const botGlobalMissing = botRequired.global.filter(permission => {
        return !botGlobalPermissions.has(permission);
    });
    if (botGlobalMissing.length) {
        return {
            authorized: false,
            payload: {
                content: `Bot is missing required global permissions: ${botGlobalMissing.join(", ")}`,
                ephemeral: true
            }
        };
    }

    if (
        botOptional.global.length &&
        !botOptional.global.some(permission => botGlobalPermissions?.has(permission))
    ) {
        return {
            authorized: false,
            payload: {
                content: `Bot does not have at least one of these global permissions: ${botOptional.global.join(", ")}`,
                ephemeral: true
            }
        };
    }

    const userGlobalMissing = userRequired.global.filter(permission => {
        return !userGlobalPermissions.has(permission, true);
    });
    if (userGlobalMissing.length) {
        return {
            authorized: false,
            payload: {
                content: `User is missing required global permissions: ${userGlobalMissing.join(", ")}`,
                ephemeral: true
            }
        };
    }

    if (
        userOptional.global.length &&
        !userOptional.global.some(permission => userGlobalPermissions?.has(permission))
    ) {
        return {
            authorized: false,
            payload: {
                content: `User does not have at least one of these global permissions: ${userOptional.global.join(", ")}`,
                ephemeral: true
            }
        };
    }

    return { authorized: true };
}

const withPermissions: IAuthorizationWithFunction<IExecutorPermissions> = {
    slash: permissions => {
        const botRequired = categorizePermissions(permissions.bot.required ?? []);
        const botOptional = categorizePermissions(permissions.bot.optional ?? []);
        const userRequired = categorizePermissions(permissions.user.required ?? []);
        const userOptional = categorizePermissions(permissions.user.optional ?? []);
        return async context => {
            if (
                (!(context.channel instanceof TextChannel) &&
                    !(context.channel instanceof VoiceChannel)) ||
                !context.guild
            )
                return { authorized: false };
            const member =
                context.member instanceof GuildMember
                    ? context.member
                    : context.member
                      ? await context.guild.members.fetch(context.member.user.id)
                      : null;
            if (!member) return { authorized: false };
            return await performCheck({
                botRequired,
                botOptional,
                userRequired,
                userOptional,
                channel: context.channel,
                guild: context.guild,
                member
            });
        };
    },
    text: permissions => {
        const botRequired = categorizePermissions(permissions.bot.required ?? []);
        const botOptional = categorizePermissions(permissions.bot.optional ?? []);
        const userRequired = categorizePermissions(permissions.user.required ?? []);
        const userOptional = categorizePermissions(permissions.user.optional ?? []);
        return async context => {
            if (
                (!(context.channel instanceof TextChannel) &&
                    !(context.channel instanceof VoiceChannel)) ||
                !context.guild
            )
                return { authorized: false };
            if (!context.member) return { authorized: false };
            return (await performCheck({
                botRequired,
                botOptional,
                userRequired,
                userOptional,
                channel: context.channel,
                guild: context.guild,
                member: context.member
            })) as CommandAuthorizationResult;
        };
    }
};

export default withPermissions;
