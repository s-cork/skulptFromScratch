import { isTrue } from "../../abstract/compare";
import { checkOneArg } from "../util/checks";
import { method_descriptor, number_slots } from "../util/class_decorators";
import { Args, Kwargs } from "../util/kwargs";
import { chainOrSuspend, handleSuspensionOrReject } from "../util/suspensions";
import { nb$and, nb$or, nb$xor, tp$new, tp$repr, ob$is } from "../util/symbols";
import { pyInt } from "./int";
import { pyObject } from "./object";
import { pyStr } from "./str";

export interface pyBool {
    $r: pyStr;
    $v: 0 | 1;
}

export class pyBool extends pyInt {
    constructor(obj?: any) {
        super();
        return isTrue(obj) ? pyTrue : pyFalse;
    }
    valueOf(): boolean {
        return !!this.$v;
    }
    [tp$new](args: Args, kws?: Kwargs): pyBool {
        checkOneArg("bool", args, kws);
        try {
            return isTrue(args[0], true) ? pyTrue : pyFalse;
        } catch (err) {
            return handleSuspensionOrReject(err, (child) =>
                chainOrSuspend(
                    () => child.resume(),
                    (v: boolean) => (v ? pyTrue : pyFalse)
                )
            );
        }
    }
    [tp$repr](): pyStr {
        return this.$r;
    }

    @number_slots
    [nb$and](other: pyObject): pyBool | pyInt {
        if (checkBool(other)) {
            return this.$v & other.$v ? pyTrue : pyFalse;
        }
        return super[nb$and](other);
    }
    [nb$or](other: pyObject): pyBool | pyInt {
        if (checkBool(other)) {
            return this.$v | other.$v ? pyTrue : pyFalse;
        }
        return super[nb$or](other);
    }
    [nb$xor](other: pyObject): pyBool | pyInt {
        if (checkBool(other)) {
            return this.$v ^ other.$v ? pyTrue : pyFalse;
        }
        return super[nb$xor](other);
    }

    [ob$is](other: pyObject): boolean {
        return other === this;
    }

    // @flag
    // not_subclassable: boolean;


    @method_descriptor({OneArg: true}, null, null)
    __format__(_: pyStr) {
        return this.$r;
    }
}

export function checkBool(obj: any): obj is pyBool {
    return obj === pyTrue || obj === pyFalse;
}

export const pyTrue: pyBool = Object.create(pyBool.prototype, {
    $v: { value: 1 },
    $r: { value: new pyStr("True") },
});

export const pyFalse: pyBool = Object.create(pyBool.prototype, {
    $v: { value: 0 },
    $r: { value: new pyStr("False") },
});