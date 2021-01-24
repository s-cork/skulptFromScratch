import { checkNoArgs } from "../util/checks";
import { buildNativeClass, number_slots } from "../util/class_decorators";
import { tp$as_number, tp$new, tp$repr, tp$slots, nb$bool, tp$name, tp$methods } from "../util/symbols";
import { pyObject } from "./object";
import { pyInterface } from "./pyinterface";
import { pyStr } from "./str";


@buildNativeClass("NoneType")
export class pyNoneType extends pyObject implements pyInterface {
    constructor() {
        super();
        return pyNone;
    }
    valueOf(): null {
        return null;
    }

    [tp$new](args: pyObject[], kws?: pyObject[]): pyNoneType {
        checkNoArgs("NoneType", args, kws);
        return pyNone;
    }
    [tp$repr]() {
        return new pyStr("None");
    }

    @number_slots
    [nb$bool]() {
        return false;
    }
}

export const pyNone: pyNoneType = Object.create(pyNoneType.prototype);

@buildNativeClass("NotImplementedType")
export class pyNotImplementedType extends pyObject implements pyInterface {
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
