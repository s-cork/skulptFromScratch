import { nb$index } from "./symbols";

export function checkIndex(obj) {
    return obj?.[nb$index] !== undefined;
}

export function checkSlice(obj) {
    return obj instanceof pySlice;
}

export function checkString(obj) {
    return obj instanceof pyStr;
}