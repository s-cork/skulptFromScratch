import { nb$index } from "../src/util/symbols";

export function asIndexSized(obj: any) {
    if (obj[nb$index] !== undefined) {
        return Number(obj[nb$index]());
    } else if (typeof obj === "number") {
        return Math.trunc(obj);
    }
    throw new TypeError("Not indexable");
}