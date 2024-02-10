import { createWriteStream, writeFileSync } from "node:fs";
import * as path from "node:path";
import { stringifyAny } from "./string-related";
import { getConfig } from "./configuration";

export interface LoggerOptions {
    color?: keyof typeof colors,
    stringBefore?: string,
    hideHour?: boolean,
    ignore?: boolean,
    category?: string,
    allowEmpty?: boolean,
    logFunction?: (message: string) => void
}

const colors = {
    default: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    blue: "\x1b[34m",
    gray: "\x1b[90m"
}

const filePath = path.join(process.cwd(), "output.log");
const stream = createWriteStream(filePath, { flags: 'a', autoClose: true });
let lastMessage = "";

function run(
    message: any,
    options: LoggerOptions = {},
): void {

    if (
        (!message && !options.allowEmpty) ||
        options.ignore
    ) return null as any; // Convenient option to just ignore this function, to make code with a lot of loggers more cleaner

    if (
        lastMessage.endsWith("\n\n") ||
        (options.stringBefore?.startsWith("\n") && lastMessage.endsWith("\n"))
    ) options.stringBefore = options.stringBefore?.trimStart();

    const stringified = (options.category ? `[${options.category}] ` : "") + stringifyAny(message);

    const color = options.color ? colors[options.color] : colors.default;
    const beforeString = options.stringBefore ? color + options.stringBefore + colors.default : '';
    const time = `${new Date().toLocaleTimeString("en-US", { hour12: true })} - `;

    const output = beforeString + (options.hideHour ? "" : color + time + colors.default) + stringified.split(/\r?\n/g).map(line => color + line + colors.default).join("\n");
    const cleanOutput = (options.stringBefore || "") + time + stringified;

    if (getConfig().logger.outputFile.enabled) {
        stream.write((getConfig().logger.outputFile.raw ? output : cleanOutput) + "\n");
    }
    lastMessage = cleanOutput;

    return options.logFunction ? options.logFunction(output) : console.log(output);

}

function clearFile() {
    writeFileSync(filePath, "");
}

export default { colors, filePath, stream, run, clearFile };