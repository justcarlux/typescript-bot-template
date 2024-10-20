import { PermissionsString } from "discord.js";

export default interface ICategorizedPermissions {
    channel: PermissionsString[];
    global: PermissionsString[];
}
