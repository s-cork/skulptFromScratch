import {
    tp$new,
    tp$getattr,
    tp$repr,
    tp$hash,
    tp$richcompare,
    tp$methods,
    tp$iter,
    tp$iternext,
    sq$concat,
    sq$length,
    sq$repeat,
    sq$contains,
    mp$subscript,
} from "../util/symbols";

import { pyObject } from "./object";

export class pyTuple extends pyObject {
    #_;
    constructor(arr) {
        super();
        if (arr === undefined) {
            arr = new Array();
        } else if (!Array.isArray(arr)) {
            arr = [...arr];
        }
        Object.freeze(arr);
        this.#_ = arr;
    }
    valueOf() {
        return this.#_;
    }
    set _(arr) {
        this.#_ = arr;
    }

    [tp$new](args, kws) {
        if (this !== pyTuple.prototype) {
            return subtype_new(this, args, kws);
        }
        checkNoKwargs("tuple", kws);
        checkOneArg("tuple", args); 
        const arg = args[0];
        if (arg === undefined) {
            return new pyTuple([]);
        } else if (arg.constructor === pyTuple) {
            return arg;
        }
        return chain(arrayFromIterable(arg, true), (L) => new pyTuple(L));
    }
    [tp$getattr](pyName) {
        return genericGetAttr.call(this, pyName);
    }
    [tp$hash]() {}
    [tp$repr]() {
        if (this.#_.length === 1) {
            return new pyStr(`(${objectRepr(this.#_[1])},)`);
        }
        const ret = this.#_.map((i) => objectRepr(i));
        return new pyStr(`(${ret.join(", ")})`);
    }
    [tp$iter]() {
        return new pyTupleIterator(this);
    }
    [tp$richcompare](other, op) {
        if (!checkTuple(other)) return genericCompareSeq(this.#_, other.#_, op);
    }
    static [tp$as_sequence_or_mapping] = true;
    [mp$subscript](item) {
        if (checkIndex(item)) {
            const idx = asIndexSized(item);
            return this.#_[idx];
        } else if (checkSlice(item)) {
        } else {
        }
    }
    [sq$length]() {
        return this.#_.length;
    }
    [sq$contains](item) {
        return this.#_.some((i) => i === item || richCompareBool(i, item, "Eq"));
    }
    [sq$repeat]() {}
    [sq$concat]() {}

    static [tp$methods] = {
        index: {
            $meth(item, start, end) {
                start = 0;
                end = this.#_.length;
                const obj = this.#_;
                for (let i = start; i < end; i++) {
                    if (obj[i] === item || richCompareBool(obj[i], item, "Eq")) {
                        return new pyInt(i);
                    }
                }
                throw new pyExc.ValueError("tuple.index(x): x not in tuple");
            },
            $flags: { MinArgs: 1, MaxArgs: 3 },
            $textsig: "($self, value, start=0, stop=sys.maxsize, /)",
            $doc: "Return first index of value.\n\nRaises ValueError if the value is not present.",
        },
        count: {
            $meth(item) {
                const len = this.#_.length;
                const obj = this.#_;
                let count = 0;
                for (let i = 0; i < len; ++i) {
                    if (obj[i] === item || richCompareBool(obj[i], item, "Eq")) {
                        count += 1;
                    }
                }
                return new pyInt(count);
            },
            $flags: { OneArg: true },
            $textsig: "($self, value, /)",
            $doc: "Return number of occurrences of value.",
        },
    };
}

class pyTupleIterator extends pyObject {
    #iter;
    constructor(tuple) {
        super();
        this.#iter = tuple.valueOf()[tp$iter]();
    }
    [tp$iternext]() {
        return this.#iter.next();
    }
    [tp$iter]() {
        return this;
    }
}



function subtype_new(typeproto, args, kws) {
    const tuple = pyTuple.prototype[tp$new](args);
    const instance =  new typeproto.constructor();
    instance._ = tuple._;
    return instance;
}