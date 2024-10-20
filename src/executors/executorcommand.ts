import Bot from "../structures/Bot";
import ExecutorOrigin from "../structures/modules/executors/ExecutorOrigin";
import IExecutorMetadata from "../structures/modules/executors/IExecutorMetadata";
import { deferOrigin, replyDeferredOrigin } from "../utils/executors";

export const metadata: IExecutorMetadata = {
    relations: {
        command: "executorcommand",
        slashCommand: { type: "command", name: "executorcommand" }
    },
    permissions: {
        bot: {
            required: ["ViewChannel", "SendMessages"]
        },
        user: {
            required: ["ManageRoles"]
        }
    }
};

export interface Command2ExecutorOptions {
    origin: ExecutorOrigin;
}

export default async function executor(_: Bot, { origin }: Command2ExecutorOptions) {
    await deferOrigin(origin);
    setTimeout(async () => {
        await replyDeferredOrigin(origin, {
            content: "Executor command!"
        });
    }, 1_000);
}
