import { BaseInteraction } from "discord.js";
import slashCommandHandler from "../../handlers/slash-commands";
import autocompleteHandler from "../../handlers/autocompletions";
import buttonHandler from "../../handlers/buttons";
import menuHandler from "../../handlers/menus";
import Event from "../../structures/Event";

export default new Event({
    name: "interactionCreate",
    once: false,
    run: async (client, interaction: BaseInteraction) => {
        if (interaction.isChatInputCommand()) slashCommandHandler(client, interaction);
        if (interaction.isAutocomplete()) autocompleteHandler(client, interaction);
        if (interaction.isButton()) buttonHandler(client, interaction);
        if (interaction.isAnySelectMenu()) menuHandler(client, interaction);
    }
})