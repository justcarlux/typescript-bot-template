import { PresenceData } from "discord.js"

export default interface IConfiguration {
    /** Enable certain bot modules */
    enable: {
        /** Command logging */
        commandsLogs: boolean,
        /** Command execution time logging */
        commandExecutionTimeLogs: boolean,
        /** Slash Commands logging */
        slashCommandsLogs: boolean,
        /** Slash Command execution time logging */
        slashCommandExecutionTimeLogs: boolean,
        /** Button interaction logging */
        buttonInteractionLogs: boolean,
        /** Menu interaction logging */
        menuInteractionLogs: boolean,
        /** Modal interaction logging */
        modalInteractionLogs: boolean,
        /** Slash Commands Autocompletion logging */
        slashCommandsAutocompletionLogs: boolean,
        /** Discord API requests logging */
        discordApiLogging: boolean,
        /** Refresh all Slash Commands when starting the bot */
        refreshSlashCommandsOnStart: boolean,
        /** Refresh all Slash Commands when joining a new guild */
        refreshSlashCommandsOnNewGuild: boolean,
        /** Presence controller */
        presence: boolean,
        /** Show a log when the presence changes */
        presenceLogs: boolean
    },
    /** List of owners with all permissions on the bot */
    owners: string[],
    /** Prefixes for text commands */
    prefixes: string[],
    /** Development mode is a mode that disables the bot functionality (commands, buttons, menus, etc) globally, and only enables it for certain channels in a certain guild */
    developmentMode: {
        /** If the mode is enabled */
        enabled: boolean,
        /** Development mode channels */
        channels: string[],
        /** Development guild information */
        guild: {
            /** Development guild ID */
            id: string
        }
    },
    /** Custom logger options */
    logger: {
        /** Logger `output.log` file options */
        outputFile: {
            /** If this file will have the console output */
            enabled: boolean,
            /** If the file will contain raw output (if false, the output will be clean) */
            raw: boolean
        }
    },
    /** Presence controller options */
    presence: {
        /** Interval (in milliseconds) in which the presence will change */
        interval: number,
        /** List of possible presences. Available variables (within <>): serverCount */
        list: PresenceData[]
    }
}