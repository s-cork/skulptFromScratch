import { getAttr, getItem, getIter } from "../../abstract/objectHelpers";
import { pyDict } from "../objects/dict";
import { pyTypeError } from "../objects/error";
import { pyObject } from "../objects/object";
import { pyStr } from "../objects/str";
import { checkString, pyCallable } from "./checks";
import { chainOrSuspend, iterForOrSuspend, pyCallOrSuspend } from "./suspensions";
import { mp$subscript, tp$dict } from "./symbols";

export interface Kwargs {
    [keys: string]: pyObject;
}

export type Args = pyObject[];

export function kwargsToNamedArgs<T = pyObject>(fnName: string, varNames: string[], args: Args, kws?: Kwargs, defaults?: T[]): Args | Array<T | pyObject> {
    const argLen = args.length;
    const kwsLen = kwargsGetSize(kws);
    const nargs = argLen + kwsLen;
    const varNameLen = varNames.length;
    const defaultsLen = (defaults || 0) && (defaults as T[]).length;
    if (nargs > varNameLen) {
        throw new pyTypeError(`${fnName}() expected at most ${varNameLen} arguments (${nargs} given)`);
    }

    if (kwsLen === 0 && (defaults === undefined || nargs === varNameLen)) {
        // no defaults supplied or position only arguments match
        return args;
    } else if (nargs === 0 && varNameLen === defaultsLen) {
        // a fast case - no args so just return the defaults
        return defaults || [];
    }
    const retArgs: Array<T | pyObject> = args.slice(0); // make a copy of args

    kws ||= {};
    for (const key in kws) {
        const val = kws[key];
        const idx = varNames.indexOf(key);
        if (idx >= 0) {
            if (retArgs[idx] !== undefined) {
                throw new pyTypeError(`${fnName}() got multiple values for argument '${key}'`);
            }
            retArgs[idx] = val;
        } else {
            throw new pyTypeError(`${fnName}() got an unexpected keyword argument '${key}'`);
        }
    }
    if (defaults !== undefined) {
        for (let i = nargs - 1; i >= 0; i--) {
            if (retArgs[i] === undefined) {
                retArgs[i] = defaults[defaultsLen - 1 - (nargs - 1 - i)];
            }
        }
        const missing = varNames.filter((_, i) => args[i] === undefined);
        if (missing.length) {
            throw new pyTypeError(`${fnName}() missing ${missing.length} required positional arguments: ${missing}`);
        }
    }
    return retArgs;
}

export function kwargsIsEmpty(kws?: Kwargs): boolean {
    if (kws === undefined) return true;
    for (let _ in kws) return false;
    return true;
}

export function kwargsGetSize(kws?: Kwargs): number {
    if (kws === undefined) return 0;
    let i = 0;
    for (let _ in kws) i++;
    return i;
}

export function kwargsToPyDict(kws?: Kwargs): pyDict {
    return pyDict.fromKwargs(kws);
}

export interface pyMapping extends pyObject {
    [mp$subscript](key: pyObject): pyObject;
    [tp$dict]: { [key: string]: pyObject; keys: pyCallable }; // keys might also be in the $d depends on the object
}

function checkMapping(mapping: any): pyObject | undefined | false {
    return mapping[mp$subscript] !== undefined && getAttr(mapping, pyStr.$keys);
}

export function kwargsFromMapping(mapping: unknown): Kwargs {
    const kws: Kwargs = {};
    if (mapping instanceof pyDict) {
        mapping.getItems().forEach(([key, val]) => {
            if (!checkString(key)) {
                throw new pyTypeError("fail");
            }
            kws[key.toString()] = val;
        });
        return kws;
    }
    const keyFn = checkMapping(mapping);
    if (keyFn) {
        return chainOrSuspend(
            () => pyCallOrSuspend(keyFn),
            (keys: pyObject) =>
                iterForOrSuspend(getIter(keys), (key, kws: Kwargs) => {
                    if (!checkString(key)) {
                        throw new pyTypeError("fail");
                    }
                    return chainOrSuspend(
                        () => getItem(mapping as pyObject, key, true, true),
                        (val: pyObject) => {
                            kws[key.toString()] = val;
                            return kws;
                        }
                    );
                })
        );
    }
    throw new pyTypeError("fail");
}
