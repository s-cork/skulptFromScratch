import { tp$call, tp$init, tp$new, tp$name, tp$repr, tp$str, tp$hash, tp$getattr, tp$setattr } from "../util/symbols";
import { pyNone, pyNoneType } from "./nonetype";
import { pyObject } from "./object";
import { pyStr } from "./str";

export interface pyInterface {
    [tp$name]: string
    [tp$init](args: pyObject[], kws?: pyObject[]): pyNoneType
    [tp$new](args: pyObject[], kws?: pyObject[]): pyObject
    [tp$call]?(args: pyObject[], kws?: pyObject[]): pyObject
    [tp$repr](): pyStr,
    [tp$str](): pyStr,
    [tp$hash](): number,
    [tp$getattr](attr: pyStr, canSuspend?: boolean): pyObject | undefined
    [tp$setattr](attr: pyStr, value: pyObject | undefined, canSuspend?: boolean): void
    
}