import { MapLike } from "../../.yarn/cache/typescript-patch-7a9e6321b3-017af99214.zip/node_modules/typescript/lib/typescript";
import { Args, Kwargs } from "../util/kwargs";
import { Suspension } from "../util/suspensions";
import {
    tp$call,
    tp$init,
    tp$new,
    tp$name,
    tp$repr,
    tp$str,
    tp$hash,
    tp$getattr,
    tp$setattr,
    tp$richcompare,
    mp$subscript,
    mp$ass_subscript
} from "../util/symbols";
import { pyNone, pyNoneType, pyNotImplementedType } from "./nonetype";
import { pyObject } from "./object";
import { pyStr } from "./str";

export type richCompareOp = "Eq" | "NotEq" | "LtE" | "GtE" | "Lt" | "Gt" ;

export interface pyInterface {
    [tp$name]: string;
    [tp$init](args: Args, kws?: Kwargs): pyNoneType;
    [tp$new](args: Args, kws?: Kwargs): pyObject;
    [tp$call]?(args: Args, kws?: Kwargs): pyObject;
    [tp$repr](): pyStr;
    [tp$str](): pyStr;
    [tp$hash](): number;
    [tp$getattr](attr: pyStr, canSuspend?: boolean): pyObject | undefined;
    [tp$setattr](
        attr: pyStr,
        value: pyObject | undefined,
        canSuspend?: boolean
    ): void;
    [tp$richcompare](
        other: pyObject,
        op: richCompareOp
    ): pyNotImplementedType | boolean;
}


export interface pySubscriptable {
    [mp$subscript](item: pyObject, canSuspend?: boolean, canThrow?: boolean): pyObject | Suspension;
}


export interface pyMutableSubscriptable extends pySubscriptable {
    [mp$ass_subscript](item: pyObject, value: pyObject | undefined, canSuspend?: boolean): void | Suspension;
}

export interface pyMapping extends pySubscriptable {
    keys(): any
}

export type kwMap = [string, pyObject];
/**
 * array of odd, even string, pyObject pairs
 */
export type kws = FlatArray<[string, pyObject][], number>[]
// export type kws: Array.flat<kwMap[]>

const x: kws = ['a', pyNone, 'b', pyNone, 'c', pyNone, 4];

var y = x[4];

// type foo = MapLike<kws[]>

// const x: foo = ["a", pyNone, "b", pyNone, "c", pyNone];


var z: Map<string, pyObject> = new Map<string, pyObject>();
var u = Array.from(z.entries())
var p = u.flat();