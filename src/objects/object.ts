import { pyLookupSpecial, typeName } from "../../abstract/object";
import {
    ob$type,
    tp$doc,
    tp$init,
    tp$new,
    tp$getattr,
    tp$setattr,
    tp$repr,
    tp$flags,
    tp$hash,
    tp$str,
    tp$richcompare,
    tp$name,
    ob$eq,
    ob$ne,
    ob$ge,
    ob$le,
    ob$gt,
    ob$lt,
} from "../util/symbols";
import { pyNotImplemented, pyNotImplementedType } from "./nonetype";
import { richCompareOp } from "./pyinterface";
import { pyStr } from "./str";

import { pyType, pyTypeConstructor } from "./type";

import { buildNativeClass, getset_descriptor, method_descriptor, generic } from "../util/class_decorators";
import { checkDict, checkString } from "../util/checks";
import { isTrue } from "../../abstract/compare";
import { pyList } from "./list";

const hashMap = new Map();

export interface pyObject {
    [ob$type]: pyType;

    [tp$name]: string;
    [tp$doc]: string | null;
    
    [tp$init](args: pyObject[], kws?: pyObject[]): void;
    [tp$new](args: pyObject[], kws?: pyObject[]): pyObject;
    [tp$repr](): pyStr;
    [tp$str](): pyStr;
    [tp$hash](): number;
    [tp$getattr](attr: pyStr, canSuspend?: boolean): pyObject | undefined;
    [tp$setattr](attr: pyStr, value: pyObject | undefined, canSuspend?: boolean): void;

    [tp$richcompare](other: pyObject, op: richCompareOp): pyNotImplementedType | boolean;
    [ob$eq](other: pyObject): pyNotImplementedType | boolean;
    [ob$ne](other: pyObject): pyNotImplementedType | boolean;
    [ob$ge](other: pyObject): pyNotImplementedType | boolean;
    [ob$le](other: pyObject): pyNotImplementedType | boolean;
    [ob$gt](other: pyObject): pyNotImplementedType | boolean;
    [ob$lt](other: pyObject): pyNotImplementedType | boolean;
    toString(): string;
    hasOwnProperty(v: string | number | symbol): boolean;
    valueOf(): pyObject | pyObject[] | string | number | bigint | null | boolean;
}
@buildNativeClass("object", "The most base type")
export class pyObject {
    toString() {
        return this[tp$str]().toString();
    }
    valueOf(): pyObject | pyObject[] | string | number | bigint | null | boolean {
        return this;
    }
    hasOwnProperty(v: string | number | symbol): boolean {
        return Object.prototype.hasOwnProperty.call(this, v);
    }

    [tp$init](args: pyObject[], kws?: pyObject[]): void {
        // see cypthon object_init for algorithm details
        if (args.length || (kws?.length)) {
            if (this[tp$init] !== pyObject.prototype[tp$init]) {
                throw new TypeError("object.__init__() takes exactly one argument (the instance to initialize)");
            }
            if (this[tp$new] === pyObject.prototype[tp$new]) {
                throw new TypeError(typeName(this) + ".__init__() takes exactly one argument (the instance to initialize)");
            }
        }
        // pyNone is returned by the __init__ descriptor
    }
    [tp$new](this: any, args: pyObject[], kws?: pyObject[]): pyObject {
        // see cypthon object_new for algorithm details
        if (args.length || (kws?.length)) {
            if (this[tp$new] !== pyObject.prototype[tp$new]) {
                throw new TypeError("object.__new__() takes exactly one argument (the type to instantiate)");
            }
            if (this[tp$init] === pyObject.prototype[tp$init]) {
                throw new TypeError(typeName(this) + "() takes no arguments");
            }
        }
        return new this.constructor();
    }

    @generic
    [tp$getattr]: (attr: pyStr, canSuspend?: boolean) => pyObject | undefined;

    @generic
    [tp$setattr]: (attr: pyStr, value: pyObject | undefined, canSuspend?: boolean) => void;

    [tp$hash](this: pyObject): number {
        let hash = hashMap.get(this) as number | undefined;
        if (hash !== undefined) {
            return hash;
        }
        hash = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER - Number.MAX_SAFE_INTEGER / 2);
        hashMap.set(this, hash);
        return hash;
    }

    [tp$repr](): pyStr {
        const mod = pyLookupSpecial(this, "__module__");
        let cname = "";
        if (checkString(mod)) {
            cname = mod.toString() + ".";
        }
        return new pyStr("<" + cname + typeName(this) + " object>");
    }
    [tp$str](): pyStr {
        return this[tp$repr]();
    }
    [tp$richcompare](other: pyObject, op: richCompareOp): boolean | pyNotImplementedType {
        if (op === "Eq") {
            return this === other || pyNotImplemented;
        } else if (op === "NotEq") {
            const res = this[ob$eq](other);
            return res !== pyNotImplemented ? !isTrue(res) : pyNotImplemented;
        }
        return pyNotImplemented;
    }
    [tp$flags]() {}

    @getset_descriptor("the object's class")
    get __class__() {
        return this[ob$type];
    }
    set __class__(v) {
        this[ob$type] = v;
    }

    @method_descriptor({ NoArgs: true }, "Default dir() implementation.")
    __dir__(): pyList<pyObject[]> {
        const dir: pyObject[] = [];
        const __dict__ = pyLookupSpecial(this, pyStr.$dict);
        if (checkDict(__dict__)) {
                dir.push(...__dict__.keys());
        }
        dir.push(...pyType.prototype.__dir__.call(this[ob$type]));
        return new pyList(dir);
    }

    @method_descriptor({ OneArg: true }, "Default object formatter.")
    __format__(f: unknown): pyStr {
        if (!checkString(f)) {
            throw new TypeError(`__format__() argument must be str, not ${typeName(f)}`);
        }
        if (f.toString()) {
            // throw new NotImplementedError("format spec is not yet implemented");
        }
        return this[tp$str]();
    }
}

Object.setPrototypeOf(pyObject, pyType.prototype);
Object.setPrototypeOf(pyObject.prototype, null);
Object.setPrototypeOf(pyType, pyType.prototype);
Object.setPrototypeOf(pyType.prototype, pyObject.prototype);


export interface pyObjectConstructor extends pyType {
    new (): pyObject;
    readonly prototype: pyObject;
}
