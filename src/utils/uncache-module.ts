export default function uncacheModule(path: string) {
    delete require.cache[require.resolve(path)];
}