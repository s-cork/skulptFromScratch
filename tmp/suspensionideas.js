
// class Suspension {
//     constructor(resume, child, data) {
//         this.resume = resume;
//         this.child = child;
//         this.data = data;
//     }
//     suspend(){
//         throw this;
//     }

//     resumeAsync(handleSuspension, resolve, reject) {
//         try {
//             resolve(this.resume());
//         } catch (maybeSuspension) {
//             Suspension.handleOrReject(maybeSuspension, handleSuspension, reject);
//         }
//     }

//     static handleOrReject(maybeSuspension, handleSuspension, reject) {
//         if (maybeSuspension instanceof Suspension) {
//             handleSuspension(maybeSuspension);
//         } else {
//             reject(maybeSuspension);
//         }
//     };

//     static suspendAsync(suspendableFn, handleSuspension, resolve, reject) {
//         try {
//             resolve(suspendableFn());
//         } catch (maybeSuspension) {
//             Suspension.handleOrReject(maybeSuspension, handleSuspension, reject);
//         }
//     }

//     [Symbol.hasInstance](instance){
//         return typeof instance?.resume === "function";
//     }
// }

// function promiseToSuspension(promise) {
//     const suspension = new Suspension();
//     suspension.resume = () => {
//         if (suspension.data.error) {
//             throw suspension.data.error;
//         }
//         return suspension.data.result;
//     }
//     suspension.data = {
//         type: "promise",
//         promise,
//     }
//     throw suspension;
// }

// function sleep(delay) {
//     return promiseToSuspension(
//         new Promise((resolve) => {
//             setTimeout(() => {resolve(null)}, delay * 1000);
//         })
//     )
// }

// function asyncToPromise(suspendableFn, suspHandler) {
//     return new Promise((resolve, reject) => {
//         function handleSuspension(susp) {
//             if (suspHandler) {
//                 const handlerPromise = suspHandler(susp);
//                 if (handlerPromise) {
//                     handlerPromise.then(resolve, (err) => Suspension.handleOrReject(err, handleSuspension, reject));
//                     return;
//                 }
//             }
//             const { type, promise, optional } = susp.data;
//             if (type === "promise") {
//                 console.log("found a promise suspension")
//                 promise.then(
//                     (res) => {
//                         susp.data.result = res;
//                         susp.resumeAsync(handleSuspension, resolve, reject);
//                     },
//                     (err) => {
//                         susp.data.error = err;
//                         susp.resumeAsync(handleSuspension, resolve, reject);
//                     }
//                 );
//             } else if (optional) {
//                 susp.resumeAsync(handleSuspension, resolve, reject);
//             } else {
//                 reject(new Error("unhandled supsension"));
//             }
//         }
//         Suspension.suspendAsync(suspendableFn, handleSuspension, resolve, reject);
//     });
// }


// function $scope0() {
//     let $loc = {};
//     let $blk = 0;
//     let $exc = [];
//     let $err;
//     $loc.__file__ = "<?>";
//     let $ret;
//     let $tmps = {};
//     let x;
//     const $wake = () => {
//         console.log("waking");
//         let susp = $scope0.$wakingSuspension;
//         ({ $loc, $blk, $exc, $err, $ret, $tmps } = susp);
//         ({ x } = $tmps);
//         $scope0.$wakingSuspension = undefined;
//     };

//     const $saveSuspension = ($child) => {
//         console.log("saving");
//         const susp = new Suspension(
//             () => {
//                 $scope0.$wakingSuspension = susp;
//                 return $scope0();
//             },
//             $child,
//             $child.data
//         );
//         $tmps = { x };
//         Object.assign(susp, { $blk, $loc, $exc, $err, $tmps });
//         $ret = susp.data.result;
//         throw susp;
//     };

//     if ($scope0.$wakingSuspension) {
//         $wake();
//     }

//     while (true) {
//         try {
//             switch ($blk) {
//                 case 0:
//                     x = 0;
//                     console.log(x, $blk);
//                     $blk = 1;
//                 case 1:
//                     $blk = 2;
//                     x += 1;
//                     console.log(x, $blk);
//                     $ret = sleep(2);
//                 case 2:
//                     x += 1;
//                     console.log(x, $blk);
//                     $blk = 3;
//                     $ret = sleep(2);
//                 case 3:
//                     x += 1;
//                     console.log(x, $blk);
//                     return "done";
//             }
//         } catch (err) {
//             Suspension.handleOrReject(
//                 err,
//                 (susp) => {
//                     $saveSuspension(susp);
//                 },
//                 (err) => {
//                     throw err;
//                 }
//             );
//         }
//     }
// }

// var r = asyncToPromise($scope0);
// r.then(
//     (res) => {
//         console.log(res);
//     },
//     (err) => {
//         console.error(err);
//     }
// );