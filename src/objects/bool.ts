import { checkOneArg } from "../util/checks";
import { chainOrSuspend } from "../util/suspensions";
import { tp$new, tp$repr } from "../util/symbols";
import {pyInt} from "./int";
import { pyObject } from "./object";
import {pyStr} from "./str";

function isTrue(obj, canSuspend?: boolean): boolean {
    return !!obj;
}


export class pyBool extends pyInt {
    $r: pyStr;
    $v: number;
    constructor(obj?: any) {
        super();
        return isTrue(obj) ? pyTrue : pyFalse;
    }
    valueOf() {
        return !!this.$v;
    }
    [tp$new](args: pyObject[], kws?: pyObject[]): pyBool {
        checkOneArg("bool", args, kws);
        return chainOrSuspend(isTrue(args[0], true), (res) => res ? pyTrue : pyFalse);
    }
    [tp$repr]() {
        return this.$r;
    }
}

export const pyTrue: pyBool = Object.create(pyBool.prototype, {
    $v: {value: 1},
    $r: {value: new pyStr("True")}
});


export const pyFalse: pyBool = Object.create(pyBool.prototype, {
    $v: {value: 0},
    $r: {value: new pyStr("False")}
});
