import { tp$call, tp$init, tp$new, tp$getattr, tp$setattr, tp$repr, tp$flags, tp$mro, ob$type, tp$base, tp$bases } from "../util/symbols";
import { pyNotImplementedType } from "./nonetype";
import { pyObject } from "./object";
import { pyInterface } from "./pyinterface";
import { pyStr } from "./str";


export interface pyType extends pyObject {
    [tp$new](args: pyObject[], kws?: pyObject[]): pyType;
    [tp$init](args: pyObject[], kws?: pyObject[]): void;
    [tp$call](args: pyObject[], kws?: pyObject[]): pyObject;
    [tp$mro]: pyObject[];
    [tp$bases]: pyObject[];
    [tp$base]: pyObject;
    [Symbol.hasInstance](obj: unknown): obj is pyType;
    
}


export interface pyTypeConstructor  {
    (obj: pyObject): pyObject;
    readonly prototype: pyType;
}

export const pyType: pyTypeConstructor = function (obj: pyObject) {
    if (new.target) {
        // fail
    }
    return obj[ob$type];
};

Object.assign(pyType.prototype, {
    [Symbol.hasInstance]: {
        value: type_instance_check,
        writable: true,
    },
    foo: {
        value: 'bar'
    },
    [tp$call]: {
        value: type_call,
        writable: true,
    },
    [tp$init]: {
        value: type_init,
        writable: true,
    },
    [tp$new]: {
        value: type_new,
        writable: true,
    },
    [tp$getattr]: {
        value: type_getattr,
        writable: true,
    },
    [tp$setattr]: {
        value: type_setattr,
        writable: true,
    },
    [tp$repr]: {
        value: type_repr,
        writable: true,
    },
    [tp$flags]: {
        value: {},
        writable: true,
    },
});


function type_call(args, kws) {
    return 'foo'
}

function type_init(args, kws) {
    return 'bar'
}

function type_new(args, kws) {

}

function type_instance_check(instance) {
    return instance !== undefined && (instance.constructor === this || instance[tp$mro].includes(this));
}


function type_getattr() {

}

function type_setattr() {

}

function type_repr() {

}
