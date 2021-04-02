import { pyNone } from "../objects/nonetype";
import { pyObject, pyObjectConstructor } from "../objects/object";
import { pyStr } from "../objects/str";
import { pyType, pyTypeConstructor } from "../objects/type";
import { ob$type, tp$base, tp$bases, tp$descr_get, tp$descr_set, tp$dict, tp$getattr, tp$hash, tp$lookup, tp$mro, tp$name } from "./symbols";

export function buildNativeClass(name: string, doc?: string) {
    return function (constructor: Function) {
        const parent = Object.getPrototypeOf(constructor);
        const proto = constructor.prototype;
        Object.defineProperties(proto, {
            [tp$name]: {
                value: name,
                writable: true,
            },
            [tp$base]: {
                value: parent,
                writable: true,
            },
            [tp$bases]: {
                value: [].concat(proto[tp$base] || []),
                writable: true,
            },
            [tp$mro]: {
                value: [constructor].concat(proto[tp$mro]),
                writable: true,
            },
            [tp$dict]: {
                value: Object.create(proto[tp$dict] || null),
                writable: true,
            },
            [tp$lookup]: {
                value: function typeLookup(pyName: pyStr): pyObject | undefined {
                    return this.prototype[tp$dict][pyName.toString()];
                },
                writable: true,
            }
        });
    }
}

export function getset_descriptor(docstring: string | null) {
    return function (
        target,
        propertyKey: string,
        descriptor?: PropertyDescriptor
    ) {
        descriptor ||= Object.getOwnPropertyDescriptor(target, propertyKey);
        const meth = descriptor.value;
        meth.docstring = docstring;
    }
}

export function method_descriptor(flags: object, docstring?: string | null, textsignature?: string | null) {
    return function (
        target: pyObject,
        propertyKey: string,
        descriptor?: PropertyDescriptor
    ) {
        const meth = descriptor?.value || Object.getOwnPropertyDescriptor(target, propertyKey)?.value;
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
        const type: pyObjectConstructor = this[ob$type];
        const descr = this[tp$lookup](pyName);
        // look in the type for a descriptor
        if (descr !== undefined) {
            f = descr[tp$descr_get] as pyDescriptor;
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

export function generic(target: pyObject, propertyKey: string | symbol): any {
    Object.defineProperty(target, propertyKey, {
        value: genericMethods[propertyKey],
        writable: true,
    });
    return genericMethods[propertyKey];
}


export function unhashable(target: typeof pyObject, propertyKey?: string | symbol) {
    Object.defineProperty(target, tp$hash, {
        value: pyNone,
        writable: true,
    }); 
}