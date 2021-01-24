import { checkNoArgs } from "../util/checks";
import { buildNativeClass, number_slots } from "../util/class_decorators";
import { tp$new, tp$repr, nb$bool } from "../util/symbols";
import { pyObject } from "./object";
import { pyInterface } from "./pyinterface";
import { pyStr } from "./str";

export interface pyNoneType extends pyObject {
    valueOf(): null;
    [tp$new](args: pyObject[], kws?: pyObject[]): pyNoneType;
    [tp$repr](): pyStr;
    [nb$bool](): boolean;
}

@buildNativeClass("NoneType")
export class pyNoneType extends pyObject {
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
    [tp$repr](): pyStr {
        return new pyStr("None");
    }

    @number_slots
    [nb$bool](): boolean {
        return false;
    }
}

export const pyNone: pyNoneType = Object.create(pyNoneType.prototype);

@buildNativeClass("NotImplementedType")
export class pyNotImplementedType extends pyObject implements pyInterface {
    constructor() {
        super();
        return pyNotImplemented;
    }
    [tp$new](args: pyObject[], kws?: pyObject[]): pyNotImplementedType {
        checkNoArgs("NotImplementedType", args, kws);
        return pyNotImplemented;
    }
    [tp$repr](): pyStr {
        return new pyStr("NotImplemented");
    }
}

export const pyNotImplemented: pyNotImplementedType = Object.create(pyNotImplementedType.prototype);
