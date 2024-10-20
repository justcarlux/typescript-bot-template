import IAuthorization from "../structures/common/IAuthorization";
import { getConfig } from "../utils/configuration";

const PAYLOAD = { content: "You're not allowed to use this!" };

const owners: IAuthorization = {
    slash: async context => {
        return {
            authorized: getConfig().owners.includes(context.user.id),
            payload: PAYLOAD
        };
    },
    text: async context => {
        return {
            authorized: getConfig().owners.includes(context.author.id),
            payload: PAYLOAD
        };
    },
    autocompletion: async context => {
        return {
            authorized: getConfig().owners.includes(context.user.id)
        };
    }
};

export default owners;
