import Command from "../Command";
import SlashCommand from "../interactions/SlashCommand";
import SlashCommandSubCommand from "../interactions/SlashCommandSubCommand";
import IExecutorPermissions from "./IExecutorPermissions";

export interface ILoadedExecutorMetadata {
    relations: {
        command: Command;
        slashCommand: SlashCommand | SlashCommandSubCommand;
    };
    permissions: IExecutorPermissions;
}
