import { objectRepr, pyGetIter, pyLookupSpecial } from "../../abstract/object";
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
} from "../util/symbols";
import { pyNone, pyNotImplemented, pyNotImplementedType } from "./nonetype";
import { pyObject } from "./object";
import { pyInterface, richCompareOp } from "./pyinterface";
import { pyStr } from "./str";
import { pyTuple } from "./tuple";

type keyValuePair = [pyObject, pyObject];
type entryType = { [hash: string]: keyValuePair };
type bucketType = { [hash: number]: keyValuePair[] };

@buildNativeClass(
    "dict",
    "dict() -> new empty dictionary\ndict(mapping) -> new dictionary initialized from a mapping object's\n    (key, value) pairs\ndict(iterable) -> new dictionary initialized as if via:\n    d = {}\n    for k, v in iterable:\n        d[k] = v\ndict(**kwargs) -> new dictionary initialized with the name=value pairs\n    in the keyword argument list.  For example:  dict(one=1, two=2)"
)

const foo: unique symbol = Symbol();

export class pyDict extends pyObject implements pyInterface {
    #entries: entryType;
    #size: number;
    #buckets: bucketType;
    #version: number;
    #in$repr: boolean;
    constructor(mapping?: keyValuePair[]) {
        super();
        this.#size = 0;
        this.#in$repr = false;
        this.#entries = Object.create(null);
        this.#buckets = {};
        this.#version = 0;
        (mapping || []).forEach(([key, val]) => {
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

    [foo](): string {
        return 'bar';
    }

    @generic
    [tp$new];

    [tp$init](args, kwargs) {
        return this.update$common(args, kwargs, "dict");
    }

    @generic
    [tp$getattr];

    @unhashable
    [tp$hash];

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

    [Symbol.iterator](): IterableIterator<pyObject> {
        return new pyDictIterator(this);
    }
    [tp$richcompare](other: pyObject, op: richCompareOp) {
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
                return otherv !== undefined && richCompareBool(val, otherv, "Eq");
            });
        }
        return op === "Eq" ? res : !res;
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
    [nb$ror](other) {
        if (!(other instanceof pyDict)) {
            return pyNotImplemented;
        }
        // dict or is not commutative so must define reflected slot here.
        const dict = other.dict$copy();
        dict.dict$merge(this);
        return dict;
    }
    [nb$ior](other) {
        return chainOrSuspend(this.update$onearg(other), () => this);
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
        throw new KeyError(key);
    }
    [mp$ass_subscript](key: pyObject, value: pyObject | undefined): void {
        if (value === undefined) {
            const item = this.pop$item(key);
            if (item === undefined) {
                throw new KeyError(key);
            }
        } else {
            this.set$item(key, value);
        }
    }

    @method_descriptor(
        { NoArgs: true },
        "D.items() -> a set-like object providing a view on D's items",
        null
    )
    items() {
        return this.getItems();
    }

    @classmethod_descriptor(
        { MinArgs: 1, MaxArgs: 2 },
        "Create a new dictionary with keys from iterable and values set to value.",
        "($type, iterable, value=None, /)"
    )
    fromkeys(this: typeof pyDict, seq: pyObject, value: pyObject | undefined) {
        value ||= pyNone;
        let dict = this === pyDict ? new this() : this[tp$call]([], []);
        return chainOrSuspend(
            dict,
            (d) => {
                dict = d;
                return iterForOrSuspend(pyGetIter(seq), (key) => {
                    return dict[mp$ass_subscript](key, value, true);
                });
            },
            () => dict
        );
    }

    private set$item(key, value) { }

    private pop$item(key) { }


}



class pyDictIterator extends pyObject implements IterableIterator<pyObject> {
    #iter: IterableIterator<keyValuePair>;
    constructor(dict: pyDict) {
        super();
        this.#iter = dict.getItems()[tp$iter]();
    }
    next(): IteratorResult<pyObject | undefined> {
        const { done, value } = this.#iter.next() as IteratorResult<keyValuePair, undefined>;
        return { done, value: done ? value[0] : undefined };
    }
    [Symbol.iterator](): pyDictIterator {
        return this;
    }
}
