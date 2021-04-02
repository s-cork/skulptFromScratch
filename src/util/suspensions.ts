import { typeName } from "../../abstract/objectHelpers";
import { pyTypeError } from "../objects/error";
import { pyObject } from "../objects/object";
import { checkCallable, pyCallable } from "./checks";
import { Args, Kwargs } from "./kwargs";
import { ob$susp_safe, tp$call } from "./symbols";

export function pyCallOrSuspend(fn: unknown, args?: Args, kws?: Kwargs): pyObject {
    if (checkCallable(fn)) return fn[tp$call](args || [], kws);
    throw new pyTypeError(`${typeName(fn)} is not callable`);
}

export function chainOrSuspend(...chainedFns: CallableFunction[]): any {
    let i = 0;
    const numChained = chainedFns.length;
    let value: any;
    try {
        while (i < numChained) {
            value = chainedFns[i++](value);
        }
        return value;
    } catch (err) {
        return handleSuspensionOrReject(err, (child) => {
            throw new Suspension(() => chainOrSuspend(() => child.resume(), ...chainedFns.slice(i)), child);
        });
    }
}

export function tryCatchOrSuspend(suspendableFn: () => any, errHandler: (err: any) => any) {
    try {
        return suspendableFn();
    } catch (err) {
        return handleSuspensionOrReject(
            err,
            (child) => {
                throw new Suspension(() => tryCatchOrSuspend(() => child.resume(), errHandler), child);
            },
            errHandler
        );
    }
}

const tmpIterator = <T>(iterResult: IteratorResult<T, T | undefined>, iterator: pyIterator<T>) => ({
    next(canSuspend?: boolean) {
        this.next = iterator.next.bind(iterator);
        return iterResult;
    },
});
export interface pyIterator<T = pyObject, TReturn = T | undefined, TNext = boolean | undefined> extends Iterator<T, TReturn, TNext> {
    [ob$susp_safe]?: boolean;
}
export interface pyIterable<T=pyObject> extends Iterable<T> {
    [ob$susp_safe]?: boolean;
    [Symbol.iterator](): pyIterator<T>
}

export interface pyIterableIterator<T=pyObject> extends IterableIterator<T> {
    [ob$susp_safe]?: boolean;
    next(canSuspend?: boolean): IteratorResult<T, T | undefined>
    [Symbol.iterator](): pyIterableIterator<T>
}

// for, map, filter, reduce on a suspendable iterator
// while
export function iterForOrSuspend<T=pyObject, R=undefined>(iterator: pyIterator<T>, forFn: (currentValue: T, prevRet: R) => R, initial?: R): R | undefined {
    let iterSuspended = true;
    let prevRet = initial;
    try {
        // we can't use for let (value of iterator) since we don't definitely know that iterator has a Symbol.iterator
        for (let next = iterator.next(true); !next.done; next = iterator.next(true)) {
            iterSuspended = false;
            prevRet = forFn(next.value, prevRet);
            iterSuspended = true;
        }
        return prevRet;
    } catch (err: any) {
        return handleSuspensionOrReject(
            err,
            (child) => {
                let resume: () => ReturnType<typeof iterForOrSuspend>;
                if (iterSuspended) {
                    resume = () =>
                        chainOrSuspend(
                            () => child.resume(),
                            (iterResult: IteratorResult<T, T | undefined>) => iterForOrSuspend(tmpIterator<T>(iterResult, iterator), forFn, prevRet)
                        );
                } else {
                    resume = () =>
                        chainOrSuspend(
                            () => child.resume(),
                            (prevRet: any) => iterForOrSuspend(iterator, forFn, prevRet)
                        );
                }
                throw new Suspension(resume, child);
            },
            (err) => {
                if (err instanceof Break) {
                    return err.brValue;
                }
                throw err;
            }
        );
    }
}

export function iterArrayOrSuspend<T=pyObject, R=undefined>(arr: Array<T>, forFn: (currentValue: T, prevRet: R) => R, initial: R): ReturnType<typeof iterForOrSuspend> {
    return iterForOrSuspend<T, R>(arr[Symbol.iterator](), forFn, initial);
}

export function arrayFromIterable<pyObject>(iterable?: pyIterable<pyObject>, canSuspend?: boolean): Array<pyObject> {
    const arr: Array<pyObject> = [];
    if (iterable === undefined) {
        return arr;
    }
    if (iterable[ob$susp_safe]) {
        return [...iterable];
    }
    const iter = iterable[Symbol.iterator]();
    if (iter[ob$susp_safe]) {
        return [...iterable];
    }
    // to do call a toArray function on the iterable e.g. tuple.toArray() which would do the obvious thing.... 
    // This should include a flag so that we know it's not inherited 
    // or maybe the iterator should have a flag that says - [willNotSuspend] - if iter[willnotsuspend] return [...iter]
    const ret = () => iterForOrSuspend(iter, (val: pyObject, arr) => {
        arr.push(val);
        return arr;
    }, arr);
    return canSuspend ? ret() : forceResumeOrThrow(ret);
}


export function forceResumeOrThrow(suspendableFn: CallableFunction, msg?: string): any {
    try {
        return suspendableFn();
    } catch (err) {
        return handleSuspensionOrReject(err, (susp) => {
            if (!susp.data.optional) {
                msg ||= "Cannot call a function that blocks or suspends here";
                throw new SuspensionError(msg);
            }
            return forceResumeOrThrow(() => susp.resume(), msg);
        });
    }
}

export class SuspensionError extends Error {}

export class Break {
    brValue: any;
    constructor(brValue?: any) {
        this.brValue = brValue;
    }
}

export function handleSuspensionOrReject(
    maybeSuspension: any,
    suspensionHandler: (susp: Suspension) =>  any,
    errorHandler: (err: any) => any = (err) => {
        throw err;
    }
) {
    if (maybeSuspension instanceof Suspension) {
        return suspensionHandler(maybeSuspension);
    } else {
        return errorHandler(maybeSuspension);
    }
}

type SuspensionType = "promise" | "yield" | "debug" | "breakpoint" | "delay" | "unknown";
interface SuspensionData {
    type: SuspensionType;
    promise?: Promise<any>;
    optional?: boolean;
    error?: any;
    result?: any;
}
export class Suspension {
    resume: CallableFunction;
    child: null | Suspension;
    data: SuspensionData;
    store: { [vars: string]: any };
    constructor(resume?: CallableFunction, child?: null | Suspension, data?: SuspensionData, store?: { [vars: string]: any }) {
        this.resume = resume || (() => {});
        this.child = child || null;
        this.data = data || child?.data || { type: "unknown" };
        this.store = store || {};
    }
    suspend(): never {
        throw this;
    }
}

export function promiseToSuspension(promise: Promise<any>): void {
    const susp = new Suspension(
        () => {
            const { error, result } = susp.data;
            if (error) {
                throw error;
            }
            return result;
        },
        null,
        {
            type: "promise",
            promise,
        }
    );
    susp.suspend();
}

type SuspensionHandlers = { [key in SuspensionType | "any"]?: (susp?: Suspension) => Promise<any> | void };

export function suspenseToPromise(suspendableFn: CallableFunction, suspHandlers: SuspensionHandlers = {}) {
    return new Promise((resolve, reject) => {
        function handleSuspension(susp: Suspension) {
            const data = susp.data;
            const { type, promise, optional } = data;
            const handler = suspHandlers[type] || suspHandlers.any;
            if (handler) {
                const handlerPromise = handler(susp);
                if (handlerPromise) {
                    handlerPromise.then(resolve, (err) => handleSuspensionOrReject(err, handleSuspension, reject));
                    return;
                }
            }

            const resumeAsync = () => {
                try {
                    resolve(susp.resume());
                } catch (maybeSuspension) {
                    handleSuspensionOrReject(maybeSuspension, handleSuspension, reject);
                }
            };

            switch (type) {
                case "promise":
                    (promise as Promise<any>).then(
                        (res?: any) => {
                            data.result = res;
                            resumeAsync();
                        },
                        (err: any) => {
                            data.error = err;
                            resumeAsync();
                        }
                    );
                    break;
                default:
                    if (optional) {
                        resumeAsync();
                    } else {
                        reject(new SuspensionError("unhandled supsension"));
                    }
            }
        }

        try {
            resolve(suspendableFn());
        } catch (maybeSuspension) {
            handleSuspensionOrReject(maybeSuspension, handleSuspension, reject);
        }
    });
}
