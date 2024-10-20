import Bot from "../../Bot";
import IExecutorMetadata from "./IExecutorMetadata";

export default interface IRawExecutorModule<O> {
    metadata: IExecutorMetadata;
    default: (client: Bot, options: O) => Promise<any>;
}
