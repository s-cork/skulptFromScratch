import { pyDict } from "../objects/dict";
import { pyObject } from "../objects/object";
import { pyStr } from "../objects/str";
import { pyTuple } from "../objects/tuple";
import { Args, Kwargs } from "./kwargs";
import { mp$ass_subscript, mp$subscript, nb$index, ob$type, tp$call, tp$iternext } from "./symbols";

export function checkPy(obj: any): obj is pyObject {
    return obj?.[ob$type] !== undefined;
}

interface Indexable {
    [nb$index](): number
}
export function checkIndex(obj: any): obj is Indexable {
    return obj?.[nb$index] !== undefined;
}

export function checkSlice(obj: any): obj is pySlice {
    return true;
    // return obj instanceof pySlice;
}

export function checkString(obj: any): obj is pyStr {
    return obj instanceof pyStr;
}


export function checkOneArg(fnName: string, args: Args, kws?: Kwargs): boolean {
    return true;
}

export function checkNoArgs(fnName: string, args: Args, kws?: Kwargs): boolean {
    return true;
}

export function checkNoKwargs(fnName: string, kws?: Kwargs): boolean {
    return true;
}

export function checkTuple(obj: any): obj is pyTuple {
    return obj instanceof pyTuple;
}

export function checkDict(obj: unknown): obj is pyDict {
    return obj instanceof pyDict;
}

export function checkIterable(iter: any): iter is IterableIterator<pyObject> {
    return iter?.[Symbol.iterator] && iter[Symbol.iterator]()[tp$iternext] !== undefined;
}


export interface pyCallable extends pyObject {
    [tp$call](args: Args, kws?: Kwargs): pyObject
}

export function checkCallable(obj: any): obj is pyCallable {
    return obj?.[tp$call] !== undefined;
}


interface pySubscriptable extends pyObject {
    [mp$subscript](item: pyObject): pyObject
}

export function checkSubscriptable(obj: any): obj is pySubscriptable {
    return obj?.[mp$subscript] !== undefined;
}

interface pyMutableSubscriptable extends pySubscriptable {
    [mp$ass_subscript](item: pyObject, val: pyObject | undefined): void;
}

export function checkMutableSubscriptable(obj: any): obj is pyMutableSubscriptable {
    return obj?.[mp$ass_subscript] !== undefined;
}