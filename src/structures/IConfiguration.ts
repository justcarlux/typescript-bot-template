export interface IConfiguration {
    /** Enable certain bot modules */
    enable: {
        /** Command logging */
        commandsLogs: boolean,
        /** Slash Commands logging */
        slashCommandsLogs: boolean,
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
        /** Refresh all Slash Commands when joining a new guild */
        refreshSlashCommandsOnNewGuild: boolean
    },
    /** List of developers with all permissions on the bot */
    developers: string[],
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
    }
}