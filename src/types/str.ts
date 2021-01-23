import { tp$richcompare, tp$str } from "../util/symbols";
import { pyNotImplemented } from "./nonetype";
import { pyObject } from "./object";

const interned: { [key: string]: pyStr } = Object.create(null);


export class pyStr extends pyObject {
    #$: string;
    #$mangled: string;
    constructor(obj?: string | pyObject) {
        super();
        const type = typeof obj;
        if (type === "undefined") {
            obj = "";
        } else if (type === "string") {
            // pass
        } else if (obj[tp$str] as pyObject) {
            return obj[tp$str]();
        }
        obj = obj as string;
        const cached = interned[obj];
        if (cached !== undefined) {
            return cached;
        }
        interned[obj] = this;
        this.#$ = obj;
    }
    [tp$str]() {
        if (this.constructor === pyStr) {
            return this;
        }
        return new pyStr(this.#$);
    }
    toString(): string {
        return this.#$;
    }
    valueOf(): string {
        return this.#$;
    }
    get $mangled(): string {
        return this.#$mangled || (this.#$mangled = fixReserved(this.#$));
    }
    [tp$richcompare](other, op) {
        if (!(other instanceof pyStr)) {
            return pyNotImplemented;
        }
        switch (op) {
            case "Lt":
                return this.#$ < other.#$;
            case "LtE":
                return this.#$ <= other.#$;
            case "Eq":
                return this.#$ === other.#$;
            case "NotEq":
                return this.#$ !== other.#$;
            case "Gt":
                return this.#$ > other.#$;
            case "GtE":
                return this.#$ >= other.#$;
        }
    }
}

export function fixReserved(str: string): string {
    return str;
}

Object.defineProperty(String.prototype, "$mangled", {
    value: fixReserved,
});

export function checkString(str:any): str is pyStr {
    return str instanceof pyStr;
}