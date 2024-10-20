import AutocompletionAuthorization from "../modules/authorizations/AutocompletionAuthorization";
import CommandAuthorization from "../modules/authorizations/CommandAuthorization";
import SlashCommandAuthorization from "../modules/authorizations/SlashCommandAuthorization";

export default interface IAuthorizationWithFunction<O> {
    slash: (options: O) => SlashCommandAuthorization;
    text: (options: O) => CommandAuthorization;
    autocompletion?: (options: O) => AutocompletionAuthorization;
}
