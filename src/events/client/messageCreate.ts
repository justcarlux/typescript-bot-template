import commandHandler from "../../handlers/commands";
import ClientEvent from "../../structures/modules/events/ClientEvent";

export default new ClientEvent({
    name: "messageCreate",
    once: false,
    run: async (client, message) => {
        commandHandler(client, message);
    }
})