import { IConfiguration } from "./src/structures/IConfiguration";

const config: IConfiguration = {
    enable: {
        commandsLogs: false,
        slashCommandsLogs: false,
        buttonInteractionLogs: false,
        menuInteractionLogs: false,
        modalInteractionLogs: false,
        slashCommandsAutocompletionLogs: false,
        discordApiLogging: false,
        refreshSlashCommandsOnNewGuild: false
    },
    developers: [],
    prefixes: [],
    developmentMode: {
        enabled: false,
        channels: [],
        guild: { id: "" }
    },
    logger: {
        outputFile: {
            enabled: false,
            raw: false
        }
    }
}

export default config;