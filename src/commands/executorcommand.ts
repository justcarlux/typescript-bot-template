import authorizations from "../authorizations";
import executor, { metadata } from "../executors/executorcommand";
import Command from "../structures/modules/Command";

export default new Command({
    name: "executorcommand",
    authorization: authorizations.withPermissions.text(metadata.permissions),
    run: async (client, message) => {
        return await executor(client, { origin: message });
    }
});
