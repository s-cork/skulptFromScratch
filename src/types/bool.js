import { tp$new, tp$repr } from "../util/symbols";
import {pyInt} from "./int";


export class pyBool extends pyInt {
    constructor(obj) {
        return isTrue(obj) ? pyTrue : pyFalse;
    }
    valueOf() {
        return !!this.$v;
    }
    [tp$new](args, kws) {
        checkOneArg("bool", args, kws);
        return chain(isTrue(args[0], true), (res) => res ? pyTrue : pyFalse);
    }
    [tp$repr]() {
        return this.$r;
    }
    static [tp$as_number] = true;
}

export const pyTrue = Object.create(pyBool.prototype, {
    $v: {value: 1},
    $r: {value: new pyStr("True")}
});


export const pyFalse = Object.create(pyBool.prototype, {
    $v: {value: 0},
    $r: {value: new pyStr("False")}
});
