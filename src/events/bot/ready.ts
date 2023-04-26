import Event from "../../structures/Event";

export default new Event({
    name: "ready",
    once: true,
    run: async (client) => {

        client.loaded = true;
        // This property is important to be set to true. Otherwise the bot will not work
        // Made for the purpose of adding asynchronous code to this event and make the bot "unresponsive" until everything finishes
        
        console.log(`Started succesfully as: ${client.user?.tag}`);

    }
})