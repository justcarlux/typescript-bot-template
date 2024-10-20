export function stringifyAny(object: any): string {
    if (object === undefined) return "undefined";
    if (object === null) return "null";
    return typeof object === "object"
        ? Object.keys(object).length
            ? JSON.stringify(object, null, 4)
            : object.toString()
        : object.toString();
}

export function upperCaseByIndexes(string: string, indexes: number[]) {
    if (!string) return string;
    return string
        .split("")
        .map((letter, index) => {
            if (!indexes.includes(index)) return letter;
            return letter.toUpperCase();
        })
        .join("");
}

export function lowerCaseByIndexes(string: string, indexes: number[]) {
    if (!string) return string;
    return string
        .split("")
        .map((letter, index) => {
            if (!indexes.includes(index)) return letter;
            return letter.toLowerCase();
        })
        .join("");
}

export function cut(text: string, maxLength: number, endString: string = "...") {
    if (text.length > maxLength) return text.substring(0, maxLength) + endString;
    return text;
}

export function parseVariables(text: string, variables: any) {
    if (!variables || !Object.keys(variables).length) return text;

    let matches = Array.from(text.matchAll(/\<[a-zA-Z0-9._-]+\>/g), e => e[0]);
    if (!matches.length) return text;

    matches = matches.map(e => {
        return e.replace(/<|>/g, "");
    });

    return text
        .split(/\<[a-zA-Z0-9._-]+\>/g)
        .map((str, index) => {
            if (index === matches.length) return str;
            return str + (variables[matches[index]] ?? `<${matches[index]}>`);
        })
        .join("");
}

export function escapeForJSON(text: string) {
    if (!text) return "";
    const stringified = JSON.stringify(text.toString());
    return stringified.slice(1, stringified.length - 1);
}
