import { asIndexSized } from "../../abstract/asindex";
import { objectRepr } from "../../abstract/object";
import { checkOneArg, checkNoKwargs, checkIndex, checkSlice, checkIterable } from "../util/checks";
import {
    buildNativeClass,
    generic,
    method_descriptor,
    sequence_or_mapping_slots,
} from "../util/class_decorators";
import { chainOrSuspend } from "../util/suspensions";
import {
    tp$new,
    tp$getattr,
    tp$repr,
    tp$hash,
    tp$richcompare,
    tp$iter,
    tp$iternext,
    sq$concat,
    sq$length,
    sq$repeat,
    sq$contains,
    mp$subscript,
} from "../util/symbols";
import { pyInt } from "./int";
import { pyNotImplemented } from "./nonetype";

import { pyObject } from "./object";
import { pyInterface, richCompareOp } from "./pyinterface";
import { pyStr } from "./str";

@buildNativeClass("tuple")
export class pyTuple<T extends pyObject[] | IterableIterator<pyObject> = pyObject[]> extends pyObject implements pyInterface {
    #_: pyObject[];
    constructor(arr?: T | undefined) {
        super();
        if (arr === undefined) {
            this.#_ = [];
        } else if (Array.isArray(arr)) {      
            this.#_ = arr;
        } else if (checkIterable(arr)) {
            this.#_ = [...arr];
        } else {
            throw TypeError("bad internal call to tuple constructor");
        }
        Object.freeze(this.#_);
    }

    valueOf() {
        return this.#_;
    }
    toString() {
        if (this.#_.length === 1) {
            return `(${objectRepr(this.#_[1])},)`;
        }
        const ret = this.#_.map((i) => objectRepr(i));
        return `(${ret.join(", ")})`;
    }
    forEach(callback: (value: pyObject, index: number, array: pyObject[]) => void): void {
        return this.#_.forEach(callback, this);
    }
    includes(searchItem: pyObject, fromIndex: number): boolean {
        return this.#_.includes(searchItem, fromIndex);
    }
    getItem(index: number|pyInt): pyObject | undefined {
        return this.#_[index.valueOf() as number];
    }


    [tp$new](this: any, args: pyObject[], kws?: pyObject[]): pyTuple {
        if (this !== pyTuple.prototype) {
            const tuple = pyTuple.prototype[tp$new](args); // don't pass kws;
            const instance = new this.constructor();
            instance.#_ = tuple.#_;
            return instance;
        }
        checkNoKwargs("tuple", kws);
        checkOneArg("tuple", args);
        const arg = args[0];
        if (arg === undefined) {
            return new pyTuple([]);
        } else if (arg.constructor === pyTuple) {
            return arg;
        }
        return chainOrSuspend(arrayFromIterable(arg, true), (L) => new pyTuple(L));
    }

    @generic
    [tp$getattr];

    [tp$hash](): number {
        return 1;
    }

    [tp$repr](): pyStr {
        return new pyStr(this.toString());
    }
    [tp$iter](): pyTupleIterator {
        return new pyTupleIterator(this);
    }
    [tp$richcompare](other: pyObject, op: richCompareOp) {
        return pyNotImplemented;
        // if (!checkTuple(other)) return genericCompareSeq(this.#_, other.#_, op);
    }

    @sequence_or_mapping_slots
    [mp$subscript](item: unknown): pyObject {
        if (checkIndex(item)) {
            const idx = asIndexSized(item);
            return this.#_[idx];
        } else if (checkSlice(item)) {
        } else {
        }
    }
    [sq$length](): number {
        return this.#_.length;
    }
    [sq$contains](item: pyObject): boolean {
        return this.#_.some((i) => i === item)/* || richCompareBool(i, item, "Eq"))*/;
    }
    [sq$repeat](): pyTuple {
        return this;
    }
    [sq$concat](): pyTuple {
        return this;
    }

    @method_descriptor(
        { MinArgs: 1, MaxArgs: 3 },
        "Return first index of value.\n\nRaises ValueError if the value is not present.",
        "($self, value, start=0, stop=sys.maxsize, /)"
    )
    index(item: pyObject, start?: pyInt | number, end?: pyInt | number) {
        start = start !== undefined ? asIndexSized(start) : 0;
        end = end !== undefined ? asIndexSized(end) : this.#_.length;
        const obj = this.#_;
        for (let i = start; i < end; i++) {
            if (obj[i] === item /*|| richCompareBool(obj[i], item, "Eq")*/) {
                return new pyInt(i);
            }
        }
        throw new /*pyExc.Value*/Error("tuple.index(x): x not in tuple");
    }

    @method_descriptor(
        { OneArg: true },
        "Return number of occurrences of value.",
        "($self, value, /)"
    )
    count(item: pyObject) {
        const len = this.#_.length;
        const obj = this.#_;
        let count = 0;
        for (let i = 0; i < len; ++i) {
            if (obj[i] === item /*|| richCompareBool(obj[i], item, "Eq")*/) {
                count += 1;
            }
        }
        return new pyInt(count);
    }
}

class pyTupleIterator extends pyObject implements IterableIterator<pyObject> {
    #iter: IterableIterator<pyObject>;
    constructor(tuple: pyTuple) {
        super();
        this.#iter = tuple.valueOf()[tp$iter]();
    }
    [tp$iternext](): IteratorResult<pyObject, pyObject> {
        return this.#iter.next();
    }
    [Symbol.iterator](): pyTupleIterator {
        return this;
    }
}



function arrayFromIterable(iter: unknown, canSuspend?: boolean) {
    if (checkIterable(iter)) {
        return [...iter];
    }
    throw TypeError("not Iterable");
}