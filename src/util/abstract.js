import { mp$subscript, mp$ass_subscript, tp$hash, ob$type, tp$lookup, tp$descr_get } from "./symbols";

export function objectGetItem(obj, item, canSuspend) {
    if (obj[mp$subscript]) {
        return obj[mp$subscript](item, canSuspend);
    }
}

export function objectSetItem(obj, item, val, canSuspend) {
    if (obj[mp$ass_subscript]) {
        return obj[mp$ass_subscript](item, val, canSuspend);
    }
}

export function objectHash(obj) {
    if (obj[tp$hash] === pyNone) {
        // oops
    }
    return obj[tp$hash]();
}

export function objectLookupSpecial(obj, pyName) {
    let func;
    func = obj[tp$lookup](pyName);
    if (func[tp$descr_get]) {
        func = func[tp$descr_get](obj, obj[ob$type]);
    }
    return func;
}

export function objectGetIter(obj) {

}

