import { tp$as_number, tp$new, tp$repr, tp$slots, nb$bool, tp$name } from "../util/symbols";
import { pyObject } from "./object";
import { pyInterface } from "./pyinterface";
import { pyStr } from "./str";

function buildNativeClass(name: string, options: {constructor: typeof pyObject, slots: object}): typeof pyObject {
    return options.constructor;
}


export class pyNoneType extends pyObject implements pyInterface {
    constructor() {
        super();
        // return pyNone;
    }
    valueOf(): null {
        return null;
    }
    [tp$new](args, kws) {
        checkNoArgs("NoneType", args, kws);
        return pyNone;
    }
    [tp$repr]() {
        return new pyStr("None");
    }
    [nb$bool]() {
        return false;
    }
}
pyNoneType.prototype[tp$name] = "NoneType";

export const _pyNoneType = buildNativeClass("NoneType", {
    constructor: class pyNoneType extends pyObject {
        constructor() {
            super();
            // return pyNone;
        }
        valueOf(): null {
            return null;
        }
    },
    slots: {
        [tp$new](args, kws) {
            checkNoArgs("NoneType", args, kws);
            return pyNone;
        },
        [tp$repr]() {
            return new pyStr("None");
        },
        [tp$as_number]: true,
        [nb$bool]() {
            return false;
        },
    },
});

export const pyNone = Object.create(pyNoneType.prototype) as pyNoneType;

// export const pyNone = new pyNoneType();

export class pyNotImplementedType extends pyObject {
    constructor() {
        super()
        return pyNotImplemented;
    }
    [tp$new](args, kws) {
        checkNoArgs("NotImplementedType", args, kws);
        return pyNotImplemented;
    }
    [tp$repr]() {
        return new pyStr("NotImplemented");
    }
}

export const pyNotImplemented: pyNotImplementedType = Object.create(pyNotImplementedType.prototype);
