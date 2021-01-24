import { pyLookupSpecial, pyTypeName } from "../../abstract/object";
import { ob$type, tp$init, tp$descr_get, tp$descr_set, tp$new, tp$getattr, tp$setattr, tp$repr, tp$flags, tp$hash, tp$str, tp$richcompare, tp$methods, tp$name, tp$getsets, tp$as_number, tp$lookup } from "../util/symbols";
import { pyNone, pyNoneType, pyNotImplemented, pyNotImplementedType } from "./nonetype";
import { pyInterface } from "./pyinterface";
import { pyStr, checkString } from "./str";

import { pyType } from "./type";

import { buildNativeClass, getset_descriptor, method_descriptor, generic } from "../util/class_decorators";

const hashMap = new Map();

@buildNativeClass("object")
export class pyObject implements pyInterface {
    $d?: object;
    $s?: object;
    $v?: any;
    toString(): string {
        return this[tp$str]().toString();
    }
    valueOf(): pyObject| pyObject[] | string | number | bigint | null | boolean {
        return this;
    }
    hasOwnProperty(v: string | number | symbol): boolean {
        return Object.prototype.hasOwnProperty.call(this, v);
    }

    [tp$name]; // keep pyInterface happy

    [tp$init](args: pyObject[], kws?: pyObject[]): pyNoneType {
        return pyNone;
    }
    [tp$new](this: any, args: pyObject[], kws?: pyObject[]): pyObject {
        return new this.constructor();
    }

    @generic
    [tp$getattr];

    @generic
    [tp$setattr];

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
        return new pyStr("<" + cname + pyTypeName(this) + " object>");
    }
    [tp$str](): pyStr {
        return this[tp$repr]();
    }
    [tp$richcompare](other: pyObject, op: string): boolean | pyNotImplementedType {
        return pyNotImplemented;
    }
    [tp$flags]() {

    }


    @getset_descriptor("the object's class")
    get __class__() {
        return this[ob$type];
    }
    set __class__(v) {
        this[ob$type] = v;
    }


    @method_descriptor({ NoArgs: true }, "Default dir() implementation.")
    __dir__(): pyStr[] {
        return Object.keys(this.constructor.prototype).map(x => new pyStr(x));
    }

    @method_descriptor({ OneArg: true }, "Default object formatter.")
    __format__(f: pyStr): pyStr {
        return this[tp$str]();
    }
}


Object.setPrototypeOf(pyObject, pyType.prototype);
Object.setPrototypeOf(pyObject.prototype, null);
Object.setPrototypeOf(pyType, pyType.prototype);
Object.setPrototypeOf(pyType.prototype, pyObject.prototype);