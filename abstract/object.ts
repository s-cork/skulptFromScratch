import { pyNone } from "../src/objects/nonetype";
import { pyObject } from "../src/objects/object";
import { pyInterface, pySubscriptable } from "../src/objects/pyinterface";
import { pyStr } from "../src/objects/str";
import { Suspension } from "../src/util/suspensions";
import { mp$subscript, mp$ass_subscript, tp$hash, ob$type, tp$lookup, tp$descr_get, tp$name, tp$repr, tp$getattr, tp$setattr } from "../src/util/symbols";

export function pyGetAttr(pyObj: pyObject, pyName: pyStr, canSuspend?: boolean): pyObject | undefined {
    return pyObj[tp$getattr](pyName, canSuspend);
}

export function pySetAttr(pyObj: pyObject, pyName: pyStr, value?: pyObject | undefined, canSuspend?: boolean): void {
    return pyObj[tp$setattr](pyName, value, canSuspend);
}

export function pyDelAttr(pyObj: pyObject, pyName: pyStr, canSuspend?: boolean): void {
    return pyObj[tp$setattr](pyName, undefined, canSuspend);
}

function checkSubscriptable(obj: unknown): obj is pySubscriptable {
    return (obj as pySubscriptable)?.[mp$subscript] !== undefined;
}

export function pyGetItem(pyObj: unknown, pyItem: pyObject, canSuspend?: boolean): pyObject | Suspension {
    if (checkSubscriptable(pyObj)) {
        return pyObj[mp$subscript](pyItem, canSuspend);
    }
    throw new /*pyExc.*/TypeError("");
}

export function pySetItem(obj: unknown, pyItem: pyObject, val?: pyObject | undefined, canSuspend?: boolean): void | Suspension {
    if (obj?.[mp$ass_subscript] !== undefined) {
        return obj[mp$ass_subscript](pyItem, val, canSuspend);
    }
    throw new /*pyExc.*/TypeError("");
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


export function typeName(obj: unknown): string {
    return obj?.[tp$name] || "<invalid type>";
}

export function objectRepr(obj: pyObject): string {
    return this[tp$repr]();
}