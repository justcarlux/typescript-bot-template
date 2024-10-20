import { PermissionsString } from "discord.js";

export default interface IExecutorPermissions {
    user: {
        /** All required permissions must be met in order for the command to work */
        required?: PermissionsString[];
        /** At least one of the optional permissions must be met in order for the command to work */
        optional?: PermissionsString[];
    };
    bot: {
        /** All required permissions must be met in order for the command to work */
        required?: PermissionsString[];
        /** At least one of the optional permissions must be met in order for the command to work */
        optional?: PermissionsString[];
    };
}
