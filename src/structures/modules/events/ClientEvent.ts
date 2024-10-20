import { ClientEvents } from "discord.js";
import Bot from "../../Bot";

export interface ClientEventData<E extends keyof ClientEvents> {
    /** Name or identifier for the Client Event */
    name: E;
    /** If this Client Event is going to be listened once */
    once?: boolean;
    /** Run function */
    run: (client: Bot, ...args: ClientEvents[E]) => void;
}

export default class ClientEvent<E extends keyof ClientEvents>
    implements ClientEventData<E>
{
    public name;
    public once;
    public run;

    constructor(data: ClientEventData<E>) {
        this.name = data.name;
        this.once = data.once ?? false;
        this.run = data.run;
    }
}
