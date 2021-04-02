import { NumericLiteral } from "../../.yarn/cache/typescript-patch-7a9e6321b3-017af99214.zip/node_modules/typescript/lib/typescript";
import { objectRepr, pyGetIter, pyLookupSpecial } from "../../abstract/objectHelpers";
import {
    buildNativeClass,
    generic,
    method_descriptor,
    number_slots,
    sequence_or_mapping_slots,
    unhashable,
    classmethod_descriptor,
} from "../util/class_decorators";
import { chainOrSuspend, iterForOrSuspend } from "../util/suspensions";
import {
    mp$ass_subscript,
    mp$subscript,
    nb$ior,
    nb$or,
    nb$ror,
    sq$contains,
    sq$length,
    tp$getattr,
    tp$hash,
    tp$init,
    tp$iter,
    tp$new,
    tp$repr,
    tp$richcompare,
    tp$call,
    nb$bool,
    tp$unhashable,
} from "../util/symbols";
import { pyNone, pyNoneType, pyNotImplemented, pyNotImplementedType } from "./nonetype";
import { pyObject, pyObjectConstructor } from "./object";
import { pyInterface, richCompareOp } from "./pyinterface";
import { pyStr } from "./str";
import { pyTuple } from "./tuple";
import {unHashable} from "../../abstract/objectHelpers";
import { pyBool, pyFalse, pyTrue } from "./bool";
import { pyRichCompareBool } from "../../abstract/compare";
import { Kwargs } from "../util/kwargs";

type keyValuePair<K=pyObject, V=pyObject> = [pyObject, pyObject];
type entryType<K=pyObject, V=pyObject> = { [keyhash: string]: keyValuePair<K, V> };
type bucketType<K, V> = { [hash: number]: keyValuePair<K, V>[] };

@buildNativeClass(
    "dict",
    "dict() -> new empty dictionary\ndict(mapping) -> new dictionary initialized from a mapping object's\n    (key, value) pairs\ndict(iterable) -> new dictionary initialized as if via:\n    d = {}\n    for k, v in iterable:\n        d[k] = v\ndict(**kwargs) -> new dictionary initialized with the name=value pairs\n    in the keyword argument list.  For example:  dict(one=1, two=2)"
)
@unhashable
export class pyDict<K = pyObject, V = pyObject> extends pyObject {
    #entries: entryType<K, V>;
    #size: number;
    #buckets: bucketType<K, V>;
    #version: number;
    #in$repr: boolean;
    constructor(keyValueArray?: keyValuePair<K, V>[]) {
        super();
        this.#size = 0;
        this.#in$repr = false;
        this.#entries = Object.create(null);
        this.#buckets = {};
        this.#version = 0;
        (keyValueArray || []).forEach(([key, val]) => {
            this.setItem(key, val);
        });
    }

    public setItem(key: pyObject, val: pyObject): void {
        this.#entries[key.toString()] = [key, val];
        this.#size++;
    }
    public getItem(key: pyObject): pyObject | undefined {
        return this.#entries[key.toString()]?.[1];
    }
    public getSize(): number {
        return this.#size;
    }
    public getItems(): keyValuePair[] {
        return Object.values(this.#entries);
    }
    public quickLookup(key: pyStr): pyObject | undefined {
        return this.#entries[key.$keyHash]?.[1];
    }
    static fromKwargs(kws?: Kwargs) {
        const dict = new pyDict<pyStr, pyObject>();
        if (kws === undefined) return dict;
        const entries: entryType = Object.create(null);
        let i = 0;
        for (let key in kws) {
            entries[key] = [new pyStr(key), kws[key]];
            i++;
        }
        dict.#entries = entries;
        dict.#size = i;
        return dict;
    } 

    @generic
    [tp$new]: (args: Args, kws?: Kwargs) => pyDict;

    [tp$init](args: Args, kws?: Kwargs): void {
        return;
        // return this.update$common(args, kwargs, "dict");
    }

    @generic
    [tp$getattr]: (attr: pyStr, canSuspend?: boolean) => pyObject | undefined;

    @unhashable
    [tp$hash]: undefined;

    [tp$repr]() {
        if (this.#in$repr) {
            // prevents recursively calling repr;
            return new pyStr("{...}");
        }
        this.#in$repr = true;
        // iterate over the keys - we don't use the dict iterator or mp$subscript here
        const ret = this.getItems().map(([key, val]) => objectRepr(key) + ": " + objectRepr(val));
        this.#in$repr = false;
        return new pyStr("{" + ret.join(", ") + "}");
    }

    [Symbol.iterator](): pyDictIterator<K> {
        return new pyDictIterator<K>(this);
    }

    [tp$richcompare](other: pyObject, op: richCompareOp): pyNotImplementedType | pyBool {
        let res: boolean;
        if (!(other instanceof pyDict) || (op !== "Eq" && op !== "NotEq")) {
            return pyNotImplemented;
        }
        if (other === this) {
            res = true;
        } else if (this.#size !== other.#size) {
            res = false;
        } else {
            let otherv: pyObject | undefined;
            res = this.items().every(([key, val]) => {
                otherv = other.getItem(key);
                return otherv !== undefined && pyRichCompareBool(val, otherv, "Eq");
            });
        }
        return op === "Eq" ? (res ? pyTrue : pyFalse) : res ? pyFalse : pyTrue;
    }

    @number_slots
    [nb$or](other: unknown): pyDict | pyNotImplementedType {
        if (!(other instanceof pyDict)) {
            return pyNotImplemented;
        }
        const dict = this.dict$copy();
        dict.dict$merge(other);
        return dict;
    }
    [nb$ror](other: unknown): pyNotImplementedType | pyDict {
        if (!(other instanceof pyDict)) {
            return pyNotImplemented;
        }
        // dict or is not commutative so must define reflected slot here.
        const dict = other.dict$copy();
        dict.dict$merge(this);
        return dict;
    }
    [nb$ior](other: unknown): pyNotImplementedType | pyDict {
        return pyNotImplemented;
        // return chainOrSuspend(this.update$onearg(other), () => this);
    }

    @sequence_or_mapping_slots
    [sq$length](): number {
        return this.getSize();
    }
    [sq$contains](obj: pyObject): boolean {
        return this.getItem(obj) !== undefined;
    }
    [mp$subscript](key: pyObject, canSuspend?: boolean): pyObject {
        const res = this.getItem(key);
        if (res !== undefined) {
            // Found in dictionary
            return res;
        }
        let missing = pyLookupSpecial(this, "__missing__");
        if (missing !== undefined) {
            const ret = pyCallOrSuspend(missing, [key]);
            return canSuspend ? ret : retryOptionalSuspensionOrThrow(ret);
        }
        throw new /*Key*/Error(key.toString());
    }
    [mp$ass_subscript](key: pyObject, value: pyObject | undefined): void {
        if (value === undefined) {
            const item = this.pop$item(key);
            if (item === undefined) {
                throw new /*Key*/ Error(key.toString());
            }
        } else {
            this.set$item(key, value);
        }
    }

    @method_descriptor({ NoArgs: true }, "D.items() -> a set-like object providing a view on D's items", null)
    items() {
        return this.getItems();
    }

    @method_descriptor({ NoArgs: true }, "D.keys() -> a set-like object providing a view on D's keys", null)
    keys() {
        return this.getItems().map((item) => item[0]);
    }

    @classmethod_descriptor({ MinArgs: 1, MaxArgs: 2 }, "Create a new dictionary with keys from iterable and values set to value.", "($type, iterable, value=None, /)")
    fromkeys(this: pyDictConstructor | typeof pyDict, seq: pyObject, value: pyObject | undefined) {
        value ||= pyNone;
        let dict: pyDict = this === pyDict ? new this() : (this as pyDictConstructor)[tp$call]([], {});
        return chainOrSuspend(
            dict,
            (d: pyDict) => {
                dict = d;
                return iterForOrSuspend(pyGetIter(seq), (key: pyObject) => {
                    return dict[mp$ass_subscript](key, value, true);
                });
            },
            () => dict
        );
    }

    private set$item(key, value) {}

    private pop$item(key) {}
}

export interface pyDictConstructor extends pyObjectConstructor<pyDict> {
    new(keyValueArray?: keyValuePair[]): pyDict;
}

class pyDictIterator<K> extends pyObject implements IterableIterator<K> {
    #iter: IterableIterator<keyValuePair<K>>;
    constructor(dict: pyDict) {
        super();
        this.#iter = dict.getItems()[Symbol.iterator]();
    }
    next(): IteratorResult<K | any> {
        const {done, value} = this.#iter.next();
        return { done, value: value ? (value as keyValuePair)[0] : undefined };
    }
    [Symbol.iterator](): pyDictIterator<K> {
        return this;
    }
}
