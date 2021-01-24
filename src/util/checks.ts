import { pyDict } from "../objects/dict";
import { pyObject } from "../objects/object";
import { pyStr } from "../objects/str";
import { pyTuple } from "../objects/tuple";
import { nb$index, tp$iternext } from "./symbols";

interface Indexable {
    [nb$index](): number
}
export function checkIndex(obj): obj is Indexable {
    return obj?.[nb$index] !== undefined;
}

export function checkSlice(obj) {
    return true;
    // return obj instanceof pySlice;
}

export function checkString(obj): obj is pyStr {
    return obj instanceof pyStr;
}


export function checkOneArg(fnName: string, args: pyObject[], kws?: pyObject[]): boolean {
    return true;
}

export function checkNoArgs(fnName: string, args: pyObject[], kws?: pyObject[]): boolean {
    return true;
}

export function checkNoKwargs(fnName: string, kws?: pyObject[]): boolean {
    return true;
}

export function checkTuple(obj: any): obj is pyTuple {
    return obj instanceof pyTuple;
}

export function checkDict(obj: unknown): obj is pyDict {
    return obj instanceof pyDict;
}

export function checkIterable(iter: unknown): iter is IterableIterator<pyObject> {
    return iter?.[Symbol.iterator] && iter[Symbol.iterator]()[tp$iternext] !== undefined;
}