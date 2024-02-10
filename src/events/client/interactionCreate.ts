import autocompleteHandler from "../../handlers/autocompletions";
import buttonHandler from "../../handlers/buttons";
import menuHandler from "../../handlers/menus";
import modalHandler from "../../handlers/modals";
import slashCommandHandler from "../../handlers/slash-commands";
import ClientEvent from "../../structures/modules/events/ClientEvent";

export default new ClientEvent({
    name: "interactionCreate",
    once: false,
    run: async (client, interaction) => {
        if (interaction.isChatInputCommand()) slashCommandHandler(client, interaction);
        if (interaction.isAutocomplete()) autocompleteHandler(client, interaction);
        if (interaction.isButton()) buttonHandler(client, interaction);
        if (interaction.isAnySelectMenu()) menuHandler(client, interaction);
        if (interaction.isModalSubmit()) modalHandler(client, interaction);
    }
})