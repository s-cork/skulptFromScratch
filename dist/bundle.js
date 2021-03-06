function suspensionChain(...chainedFns) {
    let i = 0;
    const numChained = chainedFns.length;
    let value;
    try {
        while (i < numChained) {
            value = chainedFns[i++](value);
        }
        return value;
    } catch (err) {
        Suspension.handleOrReject(err, (child) => {
            throw new Suspension(() => suspensionChain(() => child.resume(), ...chainedFns.slice(i)), child);
        });
    }
}
function suspensionIter(iterator, callback, prevIter) {
    try {
        let next = prevIter || iterator.next();
        while (!next.done) {
            callback(next.value);
            next = iterator.next();
        }
    } catch (err) {
        Suspension.handleOrReject(
            err,
            (child) => {
                throw new Suspension(
                    () =>
                        suspensionChain(
                            () => child.resume(),
                            (iterResult) => suspensionIter(iterator, callback, iterResult)
                        ),
                    child
                );
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
class SuspensionError extends Error {}
let i = 0;
const suspendingIterator = {
    next() {
        return promiseToSuspension(
            new Promise((resolve) => {
                console.log("iterating");
                setTimeout(() => resolve({ done: i > 3, value: i++ }), 1000);
            })
        );
    },
};
class Break {
    constructor(brValue) {
        this.brValue = brValue;
    }
}
class Suspension {
    constructor(resume, child, data, store) {
        this.resume = resume || (() => {});
        this.child = child || null;
        this.data = data || (child === null || child === void 0 ? void 0 : child.data) || { type: "unknown" };
        this.store = store || {};
    }
    suspend() {
        throw this;
    }
    resumeAsync(handleSuspension, resolve, reject) {
        try {
            resolve(this.resume());
        } catch (maybeSuspension) {
            Suspension.handleOrReject(maybeSuspension, handleSuspension, reject);
        }
    }
    static handleOrReject(
        maybeSuspension,
        handleSuspension,
        reject = (err) => {
            throw err;
        }
    ) {
        if (maybeSuspension instanceof Suspension) {
            return handleSuspension(maybeSuspension);
        } else {
            return reject(maybeSuspension);
        }
    }
    static suspendAsync(suspendableFn, handleSuspension, resolve, reject) {
        try {
            resolve(suspendableFn());
        } catch (maybeSuspension) {
            Suspension.handleOrReject(maybeSuspension, handleSuspension, reject);
        }
    }
}
function promiseToSuspension(promise) {
    const susp = new Suspension(
        () => {
            if (susp.data.error) {
                throw susp.data.error;
            }
            return susp.data.result;
        },
        null,
        {
            type: "promise",
            promise,
        }
    );
    susp.suspend();
}
const pyNone = {
    toString() {
        return "None";
    },
};
function sleep(delay) {
    return promiseToSuspension(
        new Promise((resolve) => {
            setTimeout(() => {
                console.log(`finished sleep after ${delay} seconds`);
                resolve(pyNone);
            }, delay * 1000);
        })
    );
}
function asyncToPromise(suspendableFn, suspHandler) {
    return new Promise((resolve, reject) => {
        function handleSuspension(susp) {
            if (suspHandler) {
                const handlerPromise = suspHandler(susp);
                if (handlerPromise) {
                    handlerPromise.then(resolve, (err) => Suspension.handleOrReject(err, handleSuspension, reject));
                    return;
                }
            }
            const { type, promise, optional } = susp.data;
            if (type === "promise") {
                promise.then(
                    (res) => {
                        susp.data.result = res;
                        susp.resumeAsync(handleSuspension, resolve, reject);
                    },
                    (err) => {
                        susp.data.error = err;
                        susp.resumeAsync(handleSuspension, resolve, reject);
                    }
                );
            } else if (optional) {
                susp.resumeAsync(handleSuspension, resolve, reject);
            } else {
                reject(new SuspensionError("unhandled supsension"));
            }
        }
        Suspension.suspendAsync(suspendableFn, handleSuspension, resolve, reject);
    });
}
const $scope0 = function $scope0() {
    let $loc = {};
    let $blk = 0;
    let $exc = [];
    let $err;
    $loc.__file__ = "<?>";
    let $ret;
    const $wake = () => {
        console.log("waking");
        let susp = $scope0.$susp;
        //@ts-ignore
        ({ $loc, $blk, $exc, $err } = susp.store);
        try {
            $ret = susp.child.resume();
        } catch (err) {
            Suspension.handleOrReject(err, (susp) => {
                $save(susp);
            });
        }
        $scope0.$susp = undefined;
    };
    const $save = (child) => {
        console.log("saving");
        const susp = new Suspension(
            () => {
                $scope0.$susp = susp;
                return $scope0();
            },
            child,
            child.data,
            { $blk, $loc, $exc, $err }
        );
        susp.suspend();
    };
    if ($scope0.$susp) {
        $wake();
    }
    while (true) {
        try {
            switch ($blk) {
                case 0:
                    $loc.x = 0;
                    console.log(`x = ${$loc.x}`);
                    $blk = 1;
                case 1:
                    $loc.x += 1;
                    console.log(`x = ${$loc.x}`);
                    // handle suspension
                    $blk = 2;
                    $ret = sleep(2);
                case 2:
                    $loc.y = $ret;
                    console.log(`sleep returned ${$loc.y}`);
                    $blk = 3;
                case 3:
                    $loc.x += 1;
                    console.log(`x = ${$loc.x}`);
                    // handle suspension
                    $blk = 4;
                    $ret = sleep(3);
                case 4:
                    $loc.y = $ret;
                    console.log(`sleep returned ${$loc.y}`);
                    $blk = 5;
                case 5:
                    $loc.x += 1;
                    console.log(`x = ${$loc.x}`);
                    $blk = 6;
                case 6:
                    $blk = 7;
                    $ret = suspensionChain(
                        () => sleep(1),
                        () => {
                            $loc.x += 1;
                            return pyNone;
                        }
                    );
                case 7:
                    $loc.y = $ret;
                    console.log(`x=${$loc.x}, y=${$loc.y}`);
                    $blk = 8;
                case 8:
                    $blk = 9;
                    suspensionIter(suspendingIterator, (i) => {
                        console.log(i);
                        $loc.x += i;
                    });
                case 9:
                    console.log(`x=${$loc.x}, y=${$loc.y}`);
                    $blk = 10;
                    $ret = foo();
                case 10:
                    console.log($ret);
                    return "done";
            }
        } catch (err) {
            Suspension.handleOrReject(err, (susp) => {
                $save(susp);
            });
        }
    }
};
$scope0.$susp = undefined;
const r = asyncToPromise($scope0);
r.then(
    (res) => {
        console.log(res);
    },
    (err) => {
        console.error(err);
    }
);
function foo() {
    return suspensionChain(
        () => bar(),
        () => 4
    );
}
function bar() {
    return suspensionChain(() => sleep(1));
}
