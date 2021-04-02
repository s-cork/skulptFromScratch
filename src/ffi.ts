import { pyFalse, pyTrue } from "./objects/bool";
import { pyDict } from "./objects/dict";
import { pyList } from "./objects/list";
import { pyNone } from "./objects/nonetype";
import { pyObject } from "./objects/object";
import { pyStr } from "./objects/str";
import { Suspension } from "./util/suspensions";
import { pyCallable } from "./util/checks";
import { mp$ass_subscript, ob$type } from "./util/symbols";

interface toPyHooks {
    funcHook?(obj: CallableFunction): pyCallable;
    dictHook?(obj: Object): pyDict;
    setHook?(obj: Set<any>): pySet;
    proxyHook?(obj: Object): pyObject;
    unhandledHook?(obj: any): pyObject;
}

export function toPy(obj: any, hooks: toPyHooks | undefined ): pyObject {
    if (obj === null || obj === undefined) {
        return pyNone;
    }

    if (obj[ob$type]) {
        return obj as pyObject;
    } else if (obj.$isPyWrapped && obj.unwrap) {
        // wrap protocol
        return obj.unwrap() as pyObject;
    }

    const type = typeof obj;
    hooks ||= {};

    if (type === "string") {
        return new pyStr(obj);
    } else if (type === "number") {
        return numberToPy(obj);
    } else if (type === "boolean") {
        return obj ? pyTrue : pyFalse;
    } else if (type === "function") {
        // should the defualt behaviour be to proxy or new Sk.builtin.func?
        // old remap used to do an Sk.builtin.func
        return hooks.funcHook ? hooks.funcHook(obj) : proxy(obj);
    } if (Array.isArray(obj)) {
        return new pyList(obj.map((x) => toPy(x, hooks)));
    } else if (type === "object") {
        const constructor = obj.constructor;
        if (constructor === Object || constructor === undefined /* Object.create(null) */) {
            return hooks.dictHook ? hooks.dictHook(obj) : toPyDict(obj, hooks);
        } else if (constructor === Uint8Array) {
            return new pyBytes(obj);
        } else if (constructor === Set) {
            return toPySet(obj, hooks);
        } else if (constructor === Map) {
            const ret = new pyDict();
            (obj as Map<any, any>).forEach((val: any, key: any) => {
                ret[mp$ass_subscript](toPy(key, hooks), toPy(val, hooks));
            });
            return ret;
        } else if (constructor === Suspension) {
            return obj as Suspension;
        } else {
            // all objects get proxied - previously they were converted to dictionaries
            // can override this behaviour with a proxy hook
            return hooks.proxyHook ? hooks.proxyHook(obj) : proxy(obj);
        }
    } else if (hooks.unhandledHook) {
        // there aren't very many types left
        // could be a symbol (unlikely)
        return hooks.unhandledHook(obj);
    }
    throw TypeError(`type ${typeof obj} cannot be converted to python`)
}