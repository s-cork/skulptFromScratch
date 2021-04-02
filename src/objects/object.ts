import { pyLookupSpecial, typeName } from "../../abstract/objectHelpers";
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
    tp$unhashable,
    tp$str,
    tp$richcompare,
    tp$name,
    ob$eq,
    ob$ne,
    ob$ge,
    ob$le,
    ob$gt,
    ob$lt,
    mp$subscript,
    tp$call,
    tp$iter,
    mp$ass_subscript,
    sq$contains,
    nb$index,
    tp$bases,
    tp$base,
    tp$dict,
    tp$lookup,
    ob$is,
} from "../util/symbols";
import { pyNone, pyNoneType, pyNotImplemented, pyNotImplementedType } from "./nonetype";
import { richCompareOp } from "./pyinterface";
import { pyStr } from "./str";

import { pyType, pyTypeConstructor } from "./type";

import { buildNativeClass, getset_descriptor, method_descriptor, generic } from "../util/class_decorators";
import { checkCallable, checkDict, checkIndex, checkIterable, checkMutableSubscriptable, checkString, checkSubscriptable } from "../util/checks";
import { isTrue, pyRichCompareBool, checkNotImplemented, hasLength } from "../../abstract/compare";
import { pyList } from "./list";
import { pyAdd, pyBinOp, pyBitAnd, pyBitOr, pyBitXor, pyDiv, pyDivMod, pyFloorDiv, pyLShift, pyMatMul, pyMod, pyMul, pyPow, pyRShift, pySub } from "../../abstract/binop";
import { pyTypeError } from "./error";
import { pyBool, pyFalse, pyTrue } from "./bool";
import { MemberExpression } from "../../.yarn/cache/typescript-patch-7a9e6321b3-017af99214.zip/node_modules/typescript/lib/typescript";
import { Args, Kwargs } from "../util/kwargs";

const hashMap: Map<pyObject, number> = new Map();

export interface pyObject {
    [ob$type]: pyType;

    [tp$name]: string;
    [tp$doc]: string | null;

    [tp$bases]: pyObject[];
    [tp$base]: pyObject;
    [tp$dict]: { [keys: string]: pyObject };

    [tp$lookup](pyAttr: pyStr): pyObject | undefined;

    [tp$init](args: Args, kws?: Kwargs): void;
    [tp$new](args: Args, kws?: Kwargs): pyObject;
    [tp$repr](): pyStr;
    [tp$str](): pyStr;
    [tp$hash]?(): number; // really this should be pyNone or function
    [tp$unhashable]?: boolean;
    [tp$getattr](attr: pyStr, canSuspend?: boolean): pyObject | undefined;
    [tp$setattr](attr: pyStr, value: pyObject | undefined, canSuspend?: boolean): void;

    // [tp$call]?:(args: Args, kws?: Kwargs) => pyObject;

    [tp$richcompare](other: pyObject, op: richCompareOp): pyNotImplementedType | pyBool | pyObject;
    [ob$eq](other: pyObject): pyNotImplementedType | pyBool | pyObject;
    [ob$ne](other: pyObject): pyNotImplementedType | pyBool | pyObject;
    [ob$ge](other: pyObject): pyNotImplementedType | pyBool | pyObject;
    [ob$le](other: pyObject): pyNotImplementedType | pyBool | pyObject;
    [ob$gt](other: pyObject): pyNotImplementedType | pyBool | pyObject;
    [ob$lt](other: pyObject): pyNotImplementedType | pyBool | pyObject;
    [ob$is](other: pyObject): boolean;
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

    [tp$init](args: Args, kws?: Kwargs): void {
        // see cypthon object_init for algorithm details
        if (args.length || kws?.length) {
            if (this[tp$init] !== pyObject.prototype[tp$init]) {
                throw new TypeError("object.__init__() takes exactly one argument (the instance to initialize)");
            }
            if (this[tp$new] === pyObject.prototype[tp$new]) {
                throw new TypeError(typeName(this) + ".__init__() takes exactly one argument (the instance to initialize)");
            }
        }
        // pyNone is returned by the __init__ descriptor
    }
    [tp$new](this: any, args: Args, kws?: Kwargs): pyObject {
        // see cypthon object_new for algorithm details
        if (args.length || kws?.length) {
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


    [tp$hash]?(this: pyObject): number {
        let hash = hashMap.get(this);
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

    [tp$richcompare](other: pyObject, op: richCompareOp): pyBool | pyObject | pyNotImplementedType {
        if (op === "Eq") {
            return (this === other && pyTrue) || pyNotImplemented;
        } else if (op === "NotEq") {
            const res = this[ob$eq](other);
            return !checkNotImplemented(res) ? (isTrue(res) ? pyFalse : pyTrue) : pyNotImplemented;
        }
        return pyNotImplemented;
    }

    [ob$is](other: pyObject): boolean {
        return other === this;
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

    getAttr(attr: pyStr): pyObject | undefined {
        return this[tp$getattr](attr);
    }
    setAttr(attr: pyStr, val: pyObject): void {
        return this[tp$setattr](attr, val);
    }
    delAttr(attr: pyStr): void {
        return this[tp$setattr](attr, undefined);
    }
    getItem(item: pyObject, canSuspend=false, withError=false): pyObject | undefined {
        if (checkSubscriptable(this)) {
            return this[mp$subscript](item);
        }
        throw new pyTypeError("not subscriptable");
    }
    setItem(item: pyObject, val: pyObject): void {
        if (checkMutableSubscriptable(this)) {
            return this[mp$ass_subscript](item, val);
        }
        throw new pyTypeError("not subscriptable");
    }
    delItem(item: pyObject): void {
        if (checkMutableSubscriptable(this)) {
            return this[mp$ass_subscript](item, undefined);
        }
        throw new pyTypeError("not subscriptable");
    }
    getIter() {
        if (checkIterable(this)) {
            return this[Symbol.iterator]();
        }
        throw new pyTypeError("not iterable");
    }
    callArgs(...args: Args): pyObject {
        if (checkCallable(this)) {
            return this[tp$call](args);
        }
        throw new pyTypeError("not callable");
    }
    callRaw(args: Args, kws?: Kwargs): pyObject {
        if (checkCallable(this)) {
            return this[tp$call](args, kws);
        }
        throw new pyTypeError("not callable");
    }
    toRepr(): string {
        return this[tp$repr]().toString();
    }
    eq(other: pyObject): boolean {
        return pyRichCompareBool(this, other, "Eq");
    }
    ne(other: pyObject): boolean {
        return pyRichCompareBool(this, other, "NotEq");
    }
    gt(other: pyObject): boolean {
        return pyRichCompareBool(this, other, "Gt");
    }
    ge(other: pyObject): boolean {
        return pyRichCompareBool(this, other, "GtE");
    }
    lt(other: pyObject): boolean {
        return pyRichCompareBool(this, other, "Lt");
    }
    le(other: pyObject): boolean {
        return pyRichCompareBool(this, other, "LtE");
    }
    is(other: pyObject): boolean {
        return this === other;
    }
    isNot(other: pyObject): boolean {
        return this !== other;
    }
    add(other: pyObject): pyObject {
        return pyAdd(this, other);
    }
    sub(other: pyObject): pyObject {
        return pySub(this, other);
    }
    mul(other: pyObject): pyObject {
        return pyMul(this, other);
    }
    matmul(other: pyObject): pyObject {
        return pyMatMul(this, other);
    }
    div(other: pyObject): pyObject {
        return pyDiv(this, other);
    }
    floorDiv(other: pyObject): pyObject {
        return pyFloorDiv(this, other);
    }
    mod(other: pyObject): pyObject {
        return pyMod(this, other);
    }
    divMod(other: pyObject): pyObject {
        return pyDivMod(this, other);
    }
    pow(other: pyObject): pyObject {
        return pyPow(this, other);
    }
    lShift(other: pyObject): pyObject {
        return pyLShift(this, other);
    }
    rShift(other: pyObject): pyObject {
        return pyRShift(this, other);
    }
    bitAnd(other: pyObject): pyObject {
        return pyBitAnd(this, other);
    }
    bitOr(other: pyObject): pyObject {
        return pyBitOr(this, other);
    }
    bitXor(other: pyObject): pyObject {
        return pyBitXor(this, other);
    }
    contains(other: pyObject): boolean {
        return this[sq$contains](other);
    }
    asIndex(): number | bigint {
        if (checkIndex(this)) {
            return this[nb$index]();
        }
        throw new pyTypeError("not indexable");
    }
}

Object.setPrototypeOf(pyObject, pyType.prototype);
Object.setPrototypeOf(pyObject.prototype, null);
Object.setPrototypeOf(pyType, pyType.prototype);
Object.setPrototypeOf(pyType.prototype, pyObject.prototype);


export interface pyObjectConstructor<T> extends pyType {
    new (): T;
    readonly prototype: T;
}