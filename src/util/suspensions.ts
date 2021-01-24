import { pyObject } from "../objects/object";
import { tp$iternext } from "./symbols";

export function chainOrSuspend(value, ...chainedFns) {
    // We try to minimse overhead when nothing suspends (the common case)
    let i = 0;
    const numFns = chainedFns.length;
    while (!(value instanceof Suspension)) {
        if (i === numFns) {
            return value;
        }
        value = chainedFns[i++](value);
    }

    // Okay, we've suspended at least once, so we're taking the slow(er) path.
    const nextStep = (r) => {
        while (i < chainedFns.length) {
            if (r instanceof Suspension) {
                return new Suspension(nextStep, r);
            }
            r = chainedFns[i++](r);
        }
        return r;
    };
    return nextStep(value);
}

const $isSuspension = Symbol("isSuspension");
export class Suspension {
    [$isSuspension]: boolean = true;
    resume: CallableFunction;
    child?: Suspension;
    data?: object;
    optional?: boolean;
    constructor(resume, child?, data?) {
        if (resume !== undefined && child !== undefined) {
            this.resume = () => resume(child.resume());
        }
        this.child = child;
        this.optional = child?.optional;
        if (data === undefined && child !== undefined) {
            this.data = child.data;
        } else {
            this.data = data;
        }
    }
    [Symbol.hasInstance](instance) {
        return instance?.[$isSuspension] === true;
    }
}

export function iterForOrSuspend(iter, forFn, initialValue?) {
    let prevValue = initialValue;

    const breakOrIterNext = (res) => {
        prevValue = res;
        return res instanceof Break ? res : iter[tp$iternext](true);
    };
    function nextStep(next) {
        while (!next.done) {
            if (next instanceof Suspension) {
                return new Suspension(nextStep, next);
            }
            if (next === Break || next instanceof Break) {
                return next.brValue;
            }
            next = chainOrSuspend(forFn(next.value, prevValue), breakOrIterNext);
        }
        return prevValue;
    }
    return nextStep(iter[tp$iternext](true));
}

export class Break {
    brValue;
    constructor(brValue) {
        this.brValue = brValue;
    }
}
