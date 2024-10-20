import { createWriteStream, existsSync, mkdirSync, WriteStream } from "node:fs";
import path from "node:path";
import { stringifyAny } from "./string-related";
import { getConfig } from "./configuration";

export const COLORS = {
    default: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    blue: "\x1b[34m",
    gray: "\x1b[90m"
};

const folderPath = path.join(process.cwd(), "logs");
try {
    if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
    }
} catch (err) {
    console.log(err);
    process.exit();
}

let lastMessage = "";
let stream: WriteStream | null = null;

function run(
    message: any,
    options: {
        color?: keyof typeof COLORS;
        stringBefore?: string;
        hideHour?: boolean;
        ignore?: boolean;
        scope?: string;
        allowEmpty?: boolean;
        logFunction?: (message: string) => void;
    } = {}
): void {
    if ((!message && !options.allowEmpty) || options.ignore) return null as any; // Convenient option to just ignore this function, to make code with a lot of loggers more cleaner

    if (
        lastMessage.endsWith("\n\n") ||
        (options.stringBefore?.startsWith("\n") && lastMessage.endsWith("\n"))
    )
        options.stringBefore = options.stringBefore?.trimStart();

    const stringified =
        (options.scope ? `[${options.scope}] ` : "") + stringifyAny(message);

    const color = options.color ? COLORS[options.color] : COLORS.default;
    const beforeString = options.stringBefore
        ? color + options.stringBefore + COLORS.default
        : "";
    const time = `${new Date().toLocaleTimeString("en-US", { hour12: true })} - `;

    const output =
        beforeString +
        (options.hideHour ? "" : color + time + COLORS.default) +
        stringified
            .split(/\r?\n/g)
            .map(line => color + line + COLORS.default)
            .join("\n");
    const cleanOutput = (options.stringBefore || "") + time + stringified;

    if (getConfig().logger.output.enabled) {
        const date = new Date();
        const filename = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}-output.log`;
        if (!stream || !(stream.path as string).endsWith(filename)) {
            if (stream) stream.close();
            stream = createWriteStream(path.join(folderPath, filename), {
                flags: "a",
                autoClose: true
            });
        }
        stream.write((getConfig().logger.output.raw ? output : cleanOutput) + "\n");
    }
    lastMessage = cleanOutput;

    return options.logFunction ? options.logFunction(output) : console.log(output);
}

export default { COLORS, run };
