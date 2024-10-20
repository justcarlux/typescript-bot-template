import { Dirent } from "fs";
import { readdir } from "fs/promises";
import path from "path";

export interface DirectoryWalkerEntry {
    path: string;
    data: Dirent;
}

export async function directoryWalker(
    directoryPath: string
): Promise<DirectoryWalkerEntry[]> {
    const result: DirectoryWalkerEntry[] = [];
    const entries = await readdir(directoryPath, { withFileTypes: true });
    for (const index in entries) {
        const entry = entries[index];
        if (entry.isDirectory()) {
            result.push(...(await directoryWalker(path.join(entry.path, entry.name))));
        }
        result.push({
            path: path.join(entry.path, entry.name),
            data: entry
        });
    }
    return result;
}
