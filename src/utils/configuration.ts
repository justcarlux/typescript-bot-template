import path from "node:path";
import uncacheModule from "./uncache-module";
import IConfiguration from "../structures/IConfiguration";
import "../../config";

const filePath = process.argv.join("").includes("ts-node")
    ? path.join(process.cwd(), "config")
    : path.join(process.cwd(), "dist", "config");

let data: IConfiguration | null = null;

export function loadConfig() {
    uncacheModule(filePath);
    data = require(filePath).default;
}

export function getConfig() {
    if (!data) throw new Error("Configuration is not loaded.");
    return data;
}
