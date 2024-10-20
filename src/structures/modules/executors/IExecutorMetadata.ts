import IExecutorPermissions from "./IExecutorPermissions";

export default interface IExecutorMetadata {
    relations: {
        command: string;
        slashCommand: { type: "command" | "subcommand"; name: string };
    };
    permissions: IExecutorPermissions;
}
