import IConfiguration from "./src/structures/IConfiguration";

const config: IConfiguration = {
    enable: {
        commandsLogs: false,
        commandExecutionTimeLogs: false,
        slashCommandsLogs: false,
        slashCommandExecutionTimeLogs: false,
        buttonInteractionLogs: false,
        menuInteractionLogs: false,
        modalInteractionLogs: false,
        slashCommandsAutocompletionLogs: false,
        discordApiLogging: false,
        refreshSlashCommandsOnStart: false,
        refreshSlashCommandsOnNewGuild: false,
        presence: false,
        presenceLogs: true
    },
    owners: [],
    prefixes: [],
    allowBotMentionAsPrefix: false,
    developmentMode: {
        enabled: false,
        channels: [],
        guild: { id: "" }
    },
    logger: {
        output: {
            enabled: false,
            raw: false
        }
    },
    presence: {
        interval: 0,
        list: []
    }
};

export default config;
