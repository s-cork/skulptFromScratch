import { pyNone } from "../objects/nonetype";
import { pyObject } from "../objects/object";
import { pyStr } from "../objects/str";
import { ob$type, tp$descr_get, tp$descr_set, tp$getattr, tp$lookup, tp$name } from "./symbols";

export function buildNativeClass(name: string, doc?: string) {
    return function (constructor: Function) {
        Object.defineProperties(constructor.prototype, {
            [tp$name]: {
                value: name,
                writable: true,
            }
        });
    }
}

export function getset_descriptor(docstring: string) {
    return function (
        target,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const meth = descriptor.value;
        meth.docstring = docstring;
    }
}

export function method_descriptor(flags: object, docstring?: string, textsignature?: string) {
    return function (
        target,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const meth = descriptor.value;
        meth.flags = flags;
        meth.docstring = docstring;
        meth.textsignature = textsignature;
        console.log('method done')
    }
}

export function classmethod_descriptor(flags: object, docstring?: string, textsignature?: string) {
    return function (
        target,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const meth = descriptor.value;
        meth.flags = flags;
        meth.docstring = docstring;
        meth.textsignature = textsignature;
        console.log('method done')
    }
}


export function number_slots(target, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    debugger;
}

export function sequence_or_mapping_slots(target, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    debugger;
}

const genericMethods = {
    [tp$getattr](this: pyObject, pyName: pyStr, canSuspend?: boolean): pyObject | undefined {
        let f;
        const type = this[ob$type];
        const descr = type[tp$lookup](pyName);
        // look in the type for a descriptor
        if (descr !== undefined) {
            f = descr[tp$descr_get];
            if (f !== undefined && descr[tp$descr_set] !== undefined) {
                // then we're a data descriptor
                return f.call(descr, this, type, canSuspend);
            }
        }
        const dict = this.$d;

        if (dict !== undefined) {
            const res = undefined;
            // const res = dict.quick$lookup(pyName);
            if (res !== undefined) {
                return res;
            }
        }
        if (f !== undefined) {
            return f.call(descr, this, type, canSuspend);
        }
        if (descr !== undefined) {
            return descr;
        }
        return;
    }
}

export function generic(target, propertyKey: string | symbol) {
    Object.defineProperty(target, propertyKey, {
        value: genericMethods[propertyKey],
        writable: true,
    });
}


export function unhashable(target, propertyKey: string | symbol) {
    Object.defineProperty(target, propertyKey, {
        value: pyNone,
        writable: true,
    }); 
}