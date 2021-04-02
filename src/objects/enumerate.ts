import { chainOrSuspend, forceResumeOrThrow, pyIterable, pyIterableIterator, pyIterator } from "../util/suspensions";
import { ob$susp_safe, tp$new } from "../util/symbols";
import { pyInt } from "./int";
import { pyObject } from "./object";
import { pyTuple } from "./tuple";

export interface pyEnumerate extends pyIterableIterator {}

@buildNativeIteratorClass(
    "enumerate",
    "Return an enumerate object.\n\n  iterable\n    an object supporting iteration\n\nThe enumerate object yields pairs containing a count (from start, which\ndefaults to zero) and a value yielded by the iterable argument.\n\nenumerate is useful for obtaining an indexed list:\n    (0, seq[0]), (1, seq[1]), (2, seq[2]), ...",
    "(iterable, start=0)"
)
export class pyEnumerate extends pyObject {
    $iter: pyIterator;
    $idx: number;
    [ob$susp_safe]?: boolean;
    constructor(iterable: pyIterator, start: number) {
        super();
        this.$iter = iterable;
        this.$idx = start;
        this[ob$susp_safe] = iterable[ob$susp_safe];

        const getNext = (canSuspend?: boolean) => this.$iter.next(canSuspend);
        const retNext = (nxt: IteratorResult<pyObject, pyObject | undefined>): IteratorResult<pyObject, pyObject | undefined> => {
            if (!nxt.done) {
                return { done: false, value: new pyTuple([new pyInt(this.$idx++), nxt.value]) };
            }
            return { done: true, value: undefined };
        };

        if (this[ob$susp_safe]) {
            this.next = () => retNext(getNext(true));
        } else {
            this.next = (canSuspend) => (canSuspend ? chainOrSuspend(getNext, retNext) : forceResumeOrThrow(() => chainOrSuspend(getNext, retNext)));
        }
    }
    next(canSuspend: boolean): IteratorResult<pyObject, pyObject | undefined> {
        return this.next(canSuspend);
    }
    [tp$new](args: Args, kws?: Kwargs) {
        let iterable: pyObject;
        let start: number;
        [iterable, start] = kwargsToNamedArgs("enumerate", ["iterable", "start"], args, kws, [new pyInt(0)]);
        const iter = iterable.getIter();
        start = asIndexOrThrow(start);
        if (this === pyEnumerate.prototype) {
            return new pyEnumerate(iter, start);
        } else {
            const instance: pyEnumerate = Reflect.construct(pyEnumerate, [iter, start], (this as any).constructor);
            return Object.assign(instance, new (this as any).constructor());
        }
    }
}

export function buildNativeIteratorClass(name: string, doc: string | null = null, textsig: string | null = null) {
    return function (constructor: Function) {
        const proto = constructor.prototype;
        Object.defineProperties(proto, {
            [Symbol.iterator]: {
                value() {
                    return this;
                },
                writable: true,
            },
        });
    };
}
