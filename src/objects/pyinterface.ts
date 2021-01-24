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

export type richCompareOp = "Eq" | "NotEq" | "LtE" | "GtE" | "Lt" | "Gt";

export interface pyInterface {
    [tp$name]: string;
    [tp$init](args: pyObject[], kws?: pyObject[]): pyNoneType;
    [tp$new](args: pyObject[], kws?: pyObject[]): pyObject;
    [tp$call]?(args: pyObject[], kws?: pyObject[]): pyObject;
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
    [mp$subscript](item: pyObject, canSuspend?: boolean): pyObject | Suspension;
}


export interface pyMutableSubscriptable extends pySubscriptable {
    [mp$ass_subscript](item: pyObject, value: pyObject | undefined, canSuspend?: boolean): void | Suspension;
}

export interface pyMapping extends pySubscriptable {
    keys(): any
}

