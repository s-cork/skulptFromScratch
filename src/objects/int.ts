import { nb$index, nb$int, tp$as_number, tp$hash, tp$repr, tp$richcompare } from "../util/symbols";
import { pyNotImplemented, pyNotImplementedType } from "./nonetype";
import { pyObject } from "./object";
import { pyStr } from "./str";

export class pyInt extends pyObject {
    $v: number | bigint;
    constructor(obj?: any) {
        super()
        const type = typeof obj;
        if (type === "undefined") {
            this.$v = 0;
        } else if (type === "number") {
            this.$v = obj;
        } else if (type === "bigint") {
            this.$v = obj;
        } else if (obj[nb$int] !== undefined) {
            return obj[nb$int]();
        }
    }
    valueOf() {
        return this.$v;
    }
    [tp$repr]() {
        return new pyStr(this.$v.toString());
    }
    [tp$hash]() {
        const v = this.$v;
        return typeof v === "number" ? v : Number(v % __MAX_SAFE);
    }
    [tp$richcompare](other: pyObject, op: string): pyNotImplementedType | boolean {
        return pyNotImplemented;
    }
    // static [tp$as_number] = true;
    [nb$index]() {
        return this.$v;
    }
}



const __MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);