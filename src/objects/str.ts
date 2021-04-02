import { tp$richcompare, tp$str } from "../util/symbols";
import { pyBool, pyFalse, pyTrue } from "./bool";
import { pyNotImplemented, pyNotImplementedType } from "./nonetype";
import { pyObject } from "./object";
import { richCompareOp } from "./pyinterface";

const interned: { [key: string]: pyStr } = Object.create(null);
export class pyStr extends pyObject {
    #$: string;
    #$mangled: string | undefined;
    #$keyHash: string | undefined;
    constructor(obj?: string | pyObject) {
        super();
        const type = typeof obj;
        this.#$ = "";
        if (type === "undefined") {
            obj = "";
        } else if (type === "string") {
            // pass
        } else if ((obj as pyObject)[tp$str]) {
            return (obj as pyObject)[tp$str]();
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
    get $keyHash(): string {
        return this.#$;
    }
    get $mangled(): string {
        return this.#$mangled || (this.#$mangled = fixReserved(this.#$));
    }
    [tp$richcompare](other: pyObject, op: richCompareOp): pyNotImplementedType | pyBool {
        if (!(other instanceof pyStr)) {
            return pyNotImplemented;
        }
        let ret: boolean | pyBool;
        switch (op) {
            case "Lt":
                ret = this.#$ < other.#$;
            case "LtE":
                ret = this.#$ <= other.#$;
            case "Eq":
                ret = this.#$ === other.#$;
            case "NotEq":
                ret = this.#$ !== other.#$;
            case "Gt":
                ret = this.#$ > other.#$;
            case "GtE":
                ret = this.#$ >= other.#$;
        }
        return ret ? pyTrue : pyFalse;
    }
}

export namespace pyStr {
    export const $module = new pyStr("__module__");
    export const $dict = new pyStr("__dict__");
    export const $keys = new pyStr("keys");
}


export function fixReserved(str: string): string {
    return str;
}
