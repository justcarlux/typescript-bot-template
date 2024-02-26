import { RestEvents } from "discord.js";
import Bot from "../../Bot";

export interface RestEventData <E extends keyof RestEvents>{
    /** Name or identifier for the Rest Event */
    name: E,
    /** If this Rest Event is going to be listened once */
    once?: boolean,
    /** Run function */
    run: (client: Bot, ...args: RestEvents[E]) => void
}

export default class RestEvent<E extends keyof RestEvents> implements RestEventData<E> {

    public name;
    public once;
    public run;

    constructor(data: RestEventData<E>) {
        this.name = data.name;
        this.once = data.once ?? false;
        this.run = data.run;
    }
    
}