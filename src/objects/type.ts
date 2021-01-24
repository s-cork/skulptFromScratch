import { tp$call, tp$init, tp$new, tp$getattr, tp$setattr, tp$repr, tp$flags, tp$mro, ob$type, tp$name} from "../util/symbols";
import { pyNotImplementedType } from "./nonetype";
import { pyObject } from "./object";
import { pyInterface } from "./pyinterface";
import { pyStr } from "./str";

interface PyType {
    [tp$new](args: pyObject[], kws?: pyObject[]): pyObject,
    [tp$init](args: pyObject[], kws?: pyObject[]): pyObject,
    [tp$call](args: pyObject[], kws?: pyObject[]): pyObject,
    [tp$getattr](name, canSuspend?: boolean): pyObject | undefined,
    [tp$repr](): pyStr,
    [tp$mro]: pyObject[],
    [ob$type]: pyObject,
}

export function pyType (obj: pyObject): pyObject {
    if (new.target) {
        // fail
    }
    return obj[ob$type];
}

var x: <Partial>(PyType) = {

}

Object.defineProperties(pyType.prototype, {
    call: {
        value: function () {
            return this[tp$call].apply(this, arguments);
        },
        writable: true,
    },
    apply: {
        value: function () {
            return this[tp$call].apply(this, arguments);
        },
        writable: true,
    },
    [Symbol.hasInstance]: {
        value: type_instance_check,
        writable: true,
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



export let _pyType;

_pyType = function() {

}
_pyType.prototype[tp$name] = "type";
