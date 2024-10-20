import { AutocompleteInteraction } from "discord.js";
import AutocompletionAuthorizationResult from "./AutocompletionAuthorizationResult";

type AutocompletionAuthorization = (
    context: AutocompleteInteraction
) => Promise<AutocompletionAuthorizationResult>;

export default AutocompletionAuthorization;
