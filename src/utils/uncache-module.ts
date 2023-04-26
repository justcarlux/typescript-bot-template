export default function uncacheModule(path: string) {
    try {
        delete require.cache[require.resolve(path)];
    } catch (err: any) {
        console.log(err?.stack || err);
    }
}