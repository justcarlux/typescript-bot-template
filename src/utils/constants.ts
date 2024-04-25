import CommandAuthorization from "../structures/modules/authorizations/CommandAuthorization";
import SlashCommandAuthorization from "../structures/modules/authorizations/SlashCommandAuthorization";
import { getConfig } from "./configuration";

const authorizations: {
    commands: {
        [key in "owners"]: CommandAuthorization
    },
    slashCommands: {
        [key in "owners"]: SlashCommandAuthorization
    }
} = {
    commands: {
        owners: (context) => {
            return {
                authorized: getConfig().owners.includes(context.author.id),
                payload: { content: "You're not allowed to use this!" }
            }
        },
    },
    slashCommands: {
        owners: (context) => {
            return {
                authorized: getConfig().owners.includes(context.user.id),
                payload: { content: "You're not allowed to use this!", ephemeral: true }
            }
        }
    }
}

export { authorizations };
