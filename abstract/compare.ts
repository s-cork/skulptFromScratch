
import { pyFalse, pyTrue } from "../src/objects/bool";
import { pyObject } from "../src/objects/object";
import { nb$bool, sq$length } from "../src/util/symbols";

export function pyRichCompare(v, w, op) {
    
}

export function pyRichCompareBool(v, w, op) {
    return isTrue(pyRichCompare(v, w, op));
}

type Boolable = {
    [nb$bool](): boolean;
}

export function isTrue(obj: pyObject | boolean | null | undefined): boolean {
    if (obj === pyTrue || obj === true) {
        return true;
    } else if (obj === pyFalse || obj === false || obj === null || obj === undefined) {
        return false;
    } else if (obj[nb$bool] !== undefined) {
        return obj[nb$bool]() as boolean;
    } else if (obj[sq$length] !== undefined) {
        return obj[sq$length]() !== 0;
    } else {
        return Boolean(obj);
    }
}
