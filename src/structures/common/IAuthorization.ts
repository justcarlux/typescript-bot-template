import AutocompletionAuthorization from "../modules/authorizations/AutocompletionAuthorization";
import CommandAuthorization from "../modules/authorizations/CommandAuthorization";
import SlashCommandAuthorization from "../modules/authorizations/SlashCommandAuthorization";

export default interface IAuthorization {
    slash: SlashCommandAuthorization;
    text: CommandAuthorization;
    autocompletion?: AutocompletionAuthorization;
}
