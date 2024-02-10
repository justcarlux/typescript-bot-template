import logger from "./logger";

export default function uncacheModule(path: string) {
    try {
        delete require.cache[require.resolve(path)];
    } catch (err: any) {
        logger.run(err?.stack ?? err, { color: "red" });
    }
}