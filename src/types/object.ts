import { pyLookupSpecial, pyTypeName } from "../../abstract/object";
import {ob$type, tp$init, tp$descr_get, tp$descr_set, tp$new, tp$getattr, tp$setattr, tp$repr, tp$flags, tp$hash, tp$str, tp$richcompare, tp$methods, tp$name, tp$getsets, tp$as_number, tp$lookup } from "../util/symbols";
import { pyNone, pyNoneType, pyNotImplementedType } from "./nonetype";
import { pyInterface } from "./pyinterface";
import { pyStr, checkString } from "./str";

import { pyType } from "./type";

interface foo {
    [tp$methods]: object,
}

const hashMap = new Map();

// "object",                                   /* tp_name */
// sizeof(PyObject),                           /* tp_basicsize */
// 0,                                          /* tp_itemsize */
// object_dealloc,                             /* tp_dealloc */
// 0,                                          /* tp_vectorcall_offset */
// 0,                                          /* tp_getattr */
// 0,                                          /* tp_setattr */
// 0,                                          /* tp_as_async */
// object_repr,                                /* tp_repr */
// 0,                                          /* tp_as_number */
// 0,                                          /* tp_as_sequence */
// 0,                                          /* tp_as_mapping */
// (hashfunc)_Py_HashPointer,                  /* tp_hash */
// 0,                                          /* tp_call */
// object_str,                                 /* tp_str */
// PyObject_GenericGetAttr,                    /* tp_getattro */
// PyObject_GenericSetAttr,                    /* tp_setattro */
// 0,                                          /* tp_as_buffer */
// Py_TPFLAGS_DEFAULT | Py_TPFLAGS_BASETYPE,   /* tp_flags */
// object_doc,                                 /* tp_doc */
// 0,                                          /* tp_traverse */
// 0,                                          /* tp_clear */
// object_richcompare,                         /* tp_richcompare */
// 0,                                          /* tp_weaklistoffset */
// 0,                                          /* tp_iter */
// 0,                                          /* tp_iternext */
// object_methods,                             /* tp_methods */
// 0,                                          /* tp_members */
// object_getsets,                             /* tp_getset */
// 0,                                          /* tp_base */
// 0,                                          /* tp_dict */
// 0,                                          /* tp_descr_get */
// 0,                                          /* tp_descr_set */
// 0,                                          /* tp_dictoffset */
// object_init,                                /* tp_init */
// PyType_GenericAlloc,                        /* tp_alloc */
// object_new,                                 /* tp_new */
// PyObject_Del,                               /* tp_free */


export class pyObject implements pyInterface {
    [tp$name]: string
    $d: pyDict | {[key:string]: pyObject} | void
    [tp$init](args: pyObject[], kws?: pyObject[]): pyNoneType {
        return pyNone;
    }
    [tp$new](this: any, args: pyObject[], kws?: pyObject[]): pyObject {
        return new this.constructor();
    }
    [tp$getattr](pyName: pyStr, canSuspend?: boolean): pyObject | undefined {
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
            const res = dict.quick$lookup(pyName);
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
    [tp$setattr](pyName: pyStr, value: pyObject | undefined): void {

    }
    [tp$hash](this: pyObject): number {
        let hash = hashMap.get(this) as number | undefined;
        if (hash !== undefined) {
            return hash;
        }
        hash = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER - Number.MAX_SAFE_INTEGER / 2);
        hashMap.set(this, hash);
        return hash;
    }
    [tp$repr](): pyStr {
        const mod = pyLookupSpecial(this, "__module__");
        let cname = "";
        if (checkString(mod)) {
            cname = mod.toString() + ".";
        }
        return new pyStr("<" + cname + pyTypeName(this) + " object>");
    }
    [tp$str](): pyStr {
        return this[tp$repr]();
    }
    [tp$richcompare](other: pyObject, op: string): boolean | pyNotImplementedType {
        return true;
    }
    [tp$flags]() { }
    toString(): string {
        return this[tp$str]().toString();
    }
    valueOf(): pyObject | string | number | bigint | null {
        return this;
    }
    hasOwnProperty(v: string | number | symbol): boolean {
        return _hasOwnProperty.call(this, v);
    }
    [tp$methods]: { $meth(any): pyObject, $textsig: string, $doc: string, $flags: { [flag: string]: boolean | [] } }
    [tp$getsets]: { $get(): pyObject, $set(value: pyObject | undefined): void, $doc: string }
    [tp$ready]: boolean
    [tp$dict]: pyDict
}

Object.defineProperties(pyObject.prototype, {
    hasOwnProperty: {
        value: Object.prototype.hasOwnProperty,
        writable: true,
    },
    valueOf: {
        value: Object.prototype.valueOf,
        writable: true,
    },
    [tp$getsets]: {
        value: {},
        writable: true,
    },
    [tp$methods]: {
        value: {},
        writable: true,
    },
    tp$methods: {
        value: 'bar'
    }
});

const _hasOwnProperty = Object.prototype.hasOwnProperty;




Object.setPrototypeOf(pyObject, pyType.prototype);
Object.setPrototypeOf(pyObject.prototype, null);
Object.setPrototypeOf(pyType, pyType.prototype);
Object.setPrototypeOf(pyType.prototype, pyObject.prototype);



const pyObject_def = {
    [tp$name]: "object",
    [tp$getattr]() {

    },
    [tp$as_number]: null,


}


