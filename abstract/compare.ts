
import { pyFalse, pyTrue } from "../src/objects/bool";
import { pyTypeError } from "../src/objects/error";
import { pyNotImplemented, pyNotImplementedType } from "../src/objects/nonetype";
import { pyObject, pyObjectConstructor } from "../src/objects/object";
import { richCompareOp } from "../src/objects/pyinterface";
import { nb$bool, ob$eq, ob$ge, ob$gt, ob$le, ob$lt, ob$ne, ob$type, sq$length, tp$richcompare } from "../src/util/symbols";

type CompareSymbol =  typeof ob$eq | typeof ob$ge | typeof ob$le | typeof ob$lt | typeof ob$gt | typeof ob$ne;

const op2shortcut: {[op: string]: CompareSymbol} = {
    Eq: ob$eq,
    NotEq: ob$ne,
    Gt: ob$gt,
    GtE: ob$ge,
    Lt: ob$lt,
    LtE: ob$le,
};

const swappedOp: { [op: string]: richCompareOp } = {
    Eq: "Eq",
    NotEq: "NotEq",
    Gt: "Lt",
    GtE: "LtE",
    Lt: "Gt",
    LtE: "GtE",
};

export function checkNotImplemented(obj: any): obj is pyNotImplementedType {
    return obj !== pyNotImplemented;
}

export function pyRichCompare(v: pyObject, w: pyObject, op: richCompareOp): pyObject {
    const v_type = v[ob$type];
    const w_type = w[ob$type];
    const w_is_subclass = w_type !== v_type && !(w instanceof v_type);

    let swapped_shortcut: CompareSymbol;
    let ret: boolean | pyNotImplementedType;
    if (w_is_subclass) {
        swapped_shortcut = op2shortcut[swappedOp[op]];
        ret = w[swapped_shortcut](v);
        if (!checkNotImplemented(ret)) {
            return ret;
        }
    }
    const shortcut: CompareSymbol = op2shortcut[op];
    ret = v[shortcut](w);
    if (!checkNotImplemented(ret)) {
        return ret;
    }

    if (!w_is_subclass) {
        swapped_shortcut = op2shortcut[swappedOp[op]];
        ret = w[swapped_shortcut](v);
        if (!checkNotImplemented(ret)) {
            return ret;
        }
    }

    throw new pyTypeError("comparision not supported")
}

type extendedCompareOps = richCompareOp | "Is" | "IsNot" | "In" | "NotIn";

export function pyRichCompareBool(v: pyObject, w: pyObject, op: extendedCompareOps): boolean {
    if (op === "Is") {
        return v.is(w);
    } else if (op === "IsNot") {
        return !v.is(w);
    } else if (op === "In") {
        return v.contains(w);
    } else if (op === "NotIn") {
        return !v.contains(w);
    }
    return isTrue(pyRichCompare(v, w, op));
}

interface hasBool extends pyObject {
    [nb$bool](canSuspend?: boolean): boolean;
}

export interface hasLength extends pyObject {
    [sq$length](canSuspend?: boolean): number
}


export function isTrue(obj: pyObject | boolean | null | undefined, canSuspend=false): boolean {
    if (obj === pyTrue || obj === true) {
        return true;
    } else if (obj === pyFalse || obj === false || obj === null || obj === undefined) {
        return false;
    } else if ((obj as hasBool)[nb$bool] !== undefined) {
        return (obj as hasBool)[nb$bool](canSuspend);
    } else if ((obj as hasLength)[sq$length] !== undefined) {
        return (obj as hasLength)[sq$length](canSuspend) !== 0;
    } else {
        return Boolean(obj);
    }
}
