import Bot from "../../Bot";
import { ILoadedExecutorMetadata } from "./ILoadedExecutorMetadata";

export default interface IExecutorModule<O> {
    metadata: ILoadedExecutorMetadata;
    executor: (client: Bot, options: O) => Promise<any>;
}
