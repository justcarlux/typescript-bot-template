import Bot from "./Bot";

interface EventData {
    name: string, // Name or identifier for the Event
    once: boolean, // If this event is going to be listened once
    run: (client: Bot, ...args: any[]) => void // Run function
}

export default class Event implements EventData {

    public name;
    public once;
    public run;

    constructor(data: EventData) {
        this.name = data.name;
        this.once = data.once;
        this.run = data.run;
    }
    
}