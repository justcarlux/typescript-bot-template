import commandHandler from "../../handlers/commands";
import ClientEvent from "../../structures/modules/events/ClientEvent";

export default new ClientEvent({
    name: "messageCreate",
    once: false,
    run: (client, message) => {
        commandHandler(client, message);
    }
});
