export function stringifyAny(object: any): string {
    if (object === undefined) return "undefined";
    if (object === null) return "null";
    return typeof object === 'object' ?
        (Object.keys(object).length ? JSON.stringify(object, null, 4) : object.toString())
    : object.toString();
}

export function upperCaseByIndexes(string: string, indexes: number[]) {
    if (!string) return string;
    return string.split("").map((letter, index) => {
       if (!indexes.includes(index)) return letter;
       return letter.toUpperCase();
    }).join("");
}

export function lowerCaseByIndexes(string: string, indexes: number[]) {
    if (!string) return string;
    return string.split("").map((letter, index) => {
       if (!indexes.includes(index)) return letter;
       return letter.toLowerCase();
    }).join("");
}

export function cut(text: string, maxLength: number, endString: string = "...") {
    if (text.length > maxLength) return text.substring(0, maxLength) + endString;
    return text;
}