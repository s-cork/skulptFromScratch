import { pyNone } from "../src/types/nonetype";
import { pyObject } from "../src/types/object";
import { mp$subscript, mp$ass_subscript, tp$hash, ob$type, tp$lookup, tp$descr_get, tp$name } from "../src/util/symbols";

export function pyGetAttr(obj, name, canSuspend?: boolean) {

}

export function pySetAttr(obj, name, value, canSuspend) {

}

export function pyDelAttr(obj, name, canSuspend) {

}

export function pyGetItem(obj, item, canSuspend) {
    if (obj[mp$subscript]) {
        return obj[mp$subscript](item, canSuspend);
    }
    throw new pyExc.TypeError("");
}

export function pySetItem(obj, item, val, canSuspend) {
    if (obj[mp$ass_subscript]) {
        return obj[mp$ass_subscript](item, val, canSuspend);
    }
}

export function pyDelItem(obj, item, canSuspend) {

}

export function pyGetHash(obj) {
    if (obj[tp$hash] === pyNone) {
        // oops
    }
    return obj[tp$hash]();
}

export function pyLookupSpecial(obj, pyName) {
    let func;
    func = obj[tp$lookup](pyName);
    if (func[tp$descr_get]) {
        func = func[tp$descr_get](obj, obj[ob$type]);
    }
    return func;
}

export function pyGetIter(obj) {

}

export function pyIterNext(obj) {

}

export function pyIsInstance(obj, obj_type) {

}

export function pyIsSubclass(cls1, cls2) {

}


export function pyTypeName(obj: pyObject): string {
    return obj?.[tp$name] || "<invalid type>";
}