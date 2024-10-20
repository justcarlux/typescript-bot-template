import { ApplicationCommandOptionChoiceData } from "discord.js";
import IAuthorizationResult from "./IAuthorizationResult";

type AutocompletionAuthorizationResult = IAuthorizationResult<
    ApplicationCommandOptionChoiceData[]
>;
export default AutocompletionAuthorizationResult;
