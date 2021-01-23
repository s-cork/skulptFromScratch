import { pyFalse, pyTrue } from "../src/types/bool";
import { nb$bool, sq$length } from "../src/util/symbols";

export function pyRichCompare(v, w, op) {
    
}

export function pyRichCompareBool(v, w, op) {
    return isTrue(pyRichCompare(v, w, op));
}

export function isTrue(obj) {
    if (obj === pyTrue || obj === true) {
        return true;
    } else if (obj === pyFalse || obj === false || obj === null || obj === undefined) {
        return false;
    } else if (obj[nb$bool] !== undefined) {
        return obj[nb$bool]();
    } else if (obj[sq$length] !== undefined) {
        return obj[sq$length]() !== 0;
    } else {
        return Boolean(obj);
    }
}
