import { nb$index, tp$as_number, tp$hash, tp$repr, tp$richcompare } from "../util/symbols";
import { pyObject } from "./object";

export class pyInt extends pyObject {
    $v;
    constructor(v) {
        super()
        const type = typeof v;
        if (type === "undefined") {
            this.$v = 0;
        } else if (type === "number") {
            this.$v = v;
        } else if (type === "bigint") {
            this.$v = v;
        } else if (v[nb$int] !== undefined) {
            return v[nb$int]();
        }
    }
    [tp$repr]() {
        return new pyStr(this.$v.toString());
    }
    [tp$hash]() {
        const v = this.$v;
        return typeof v === "number" ? v : Number(v % __MAX_SAFE);
    }
    [tp$richcompare](other, op) {

    }
    static [tp$as_number] = true;
    [nb$index]() {
        return this.$v;
    }

}



const __MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);