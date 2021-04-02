Sk.execStart = Sk.lastYield = new Date();
$compiledmod = (function () {
    var $scope0 = function ($forcegbl) {
        var $loadname4, $iter7, $loadname4, $call6, $iter7, $loadname9, $loadname15, $loadname16;
        var $wakeFromSuspension = function () {
            var susp = $scope0.$wakingSuspension;
            $scope0.$wakingSuspension = undefined;
            $blk = susp.$blk;
            $loc = susp.$loc;
            $gbl = susp.$gbl;
            $exc = susp.$exc;
            $err = susp.$err;
            $postfinally = susp.$postfinally;
            $currLineNo = susp.$lineno;
            $currColNo = susp.$colno;
            Sk.lastYield = Date.now();
            $loadname4 = susp.$tmps.$loadname4;
            $iter7 = susp.$tmps.$iter7;
            $call6 = susp.$tmps.$call6;
            $loadname9 = susp.$tmps.$loadname9;
            $loadname15 = susp.$tmps.$loadname15;
            $loadname16 = susp.$tmps.$loadname16;
            try {
                $ret = susp.child.resume();
            } catch (err) {
                if (!(err instanceof Sk.builtin.BaseException)) {
                    err = new Sk.builtin.ExternalError(err);
                }
                err.traceback.push({
                    lineno: $currLineNo,
                    colno: $currColNo,
                    filename: "<stdin>.py",
                });
                if ($exc.length > 0) {
                    $err = err;
                    $blk = $exc.pop();
                } else {
                    throw err;
                }
            }
        };
        var $saveSuspension = function ($child, $filename, $lineno, $colno) {
            var susp = new Sk.misceval.Suspension();
            susp.child = $child;
            susp.resume = function () {
                $scope0.$wakingSuspension = susp;
                return $scope0();
            };
            susp.data = susp.child.data;
            susp.$blk = $blk;
            susp.$loc = $loc;
            susp.$gbl = $gbl;
            susp.$exc = $exc;
            susp.$err = $err;
            susp.$postfinally = $postfinally;
            susp.$filename = $filename;
            susp.$lineno = $lineno;
            susp.$colno = $colno;
            susp.optional = susp.child.optional;
            susp.$tmps = {
                $loadname4: $loadname4,
                $iter7: $iter7,
                $call6: $call6,
                $loadname9: $loadname9,
                $loadname15: $loadname15,
                $loadname16: $loadname16,
            };
            return susp;
        };
        var $gbl = $forcegbl || {},
            $blk = 0,
            $exc = [],
            $loc = $gbl,
            $cell = {},
            $err = undefined;
        $loc.__file__ = new Sk.builtins.str("<stdin>.py");
        var $ret = undefined,
            $postfinally = undefined,
            $currLineNo = undefined,
            $currColNo = undefined;
        if (typeof Sk.execStart === "undefined") {
            Sk.execStart = Date.now();
        }
        if (typeof Sk.lastYield === "undefined") {
            Sk.lastYield = Date.now();
        }
        if ($scope0.$wakingSuspension !== undefined) {
            $wakeFromSuspension();
        }
        if (Sk.retainGlobals) {
            if (Sk.globals) {
                $gbl = Sk.globals;
                Sk.globals = $gbl;
                $loc = $gbl;
            }
            if (Sk.globals) {
                $gbl = Sk.globals;
                Sk.globals = $gbl;
                $loc = $gbl;
                $loc.__file__ = new Sk.builtins.str("<stdin>.py");
            } else {
                Sk.globals = $gbl;
            }
        } else {
            Sk.globals = $gbl;
        }
        while (true) {
            try {
                var $dateNow = Date.now();
                if ($dateNow - Sk.execStart > Sk.execLimit) {
                    throw new Sk.builtin.TimeLimitError(Sk.timeoutMsg());
                }
                if ($dateNow - Sk.lastYield > Sk.yieldLimit) {
                    var $susp = $saveSuspension(
                        {
                            data: {
                                type: "Sk.yield",
                            },
                            resume: function () {},
                        },
                        "<stdin>.py",
                        $currLineNo,
                        $currColNo
                    );
                    $susp.$blk = $blk;
                    $susp.optional = true;
                    return $susp;
                }
                switch ($blk) {
                    case 0 /* --- module entry --- */: // // line 1: // from time import sleep // ^ //
                        $currLineNo = 1;
                        $currColNo = 0;

                        $ret = Sk.builtin.__import__("time", $gbl, $loc, ["sleep"], -1);
                        $blk = 1; /* allowing case fallthrough */
                    case 1:
                        /* --- function return or resume suspension --- */ if ($ret && $ret.$isSuspension) {
                            return $saveSuspension($ret, "<stdin>.py", 1, 0);
                        }
                        var $module1 = $ret;
                        var $item2 = Sk.abstr.gattr($module1, new Sk.builtin.str("sleep"), undefined);
                        $loc.sleep = $item2; // // line 3: // x = 0 // ^ //
                        $currLineNo = 3;
                        $currColNo = 0;

                        $loc.x = $scope0.$const3; // // line 4: // for i in range(4): // ^ //
                        $currLineNo = 4;
                        $currColNo = 0;

                        var $loadname4 = $loc.range !== undefined ? $loc.range : Sk.misceval.loadname("range", $gbl);
                        $ret = $loadname4.tp$call ? $loadname4.tp$call([$scope0.$const5], undefined) : Sk.misceval.applyOrSuspend($loadname4, undefined, undefined, undefined, [$scope0.$const5]);
                        $blk = 5; /* allowing case fallthrough */
                    case 5:
                        /* --- function return or resume suspension --- */ if ($ret && $ret.$isSuspension) {
                            return $saveSuspension($ret, "<stdin>.py", 4, 9);
                        }
                        var $call6 = $ret; // // line 4: // for i in range(4): //          ^ //
                        $currLineNo = 4;
                        $currColNo = 9;

                        var $iter7 = Sk.abstr.iter($call6);
                        $blk = 2; /* allowing case fallthrough */
                    case 2:
                        /* --- for start --- */ $ret = Sk.abstr.iternext($iter7, true);
                        $blk = 6; /* allowing case fallthrough */
                    case 6:
                        /* --- function return or resume suspension --- */ if ($ret && $ret.$isSuspension) {
                            return $saveSuspension($ret, "<stdin>.py", 4, 0);
                        }
                        var $next8 = $ret;
                        if ($next8 === undefined) {
                            $blk = 3;
                            continue;
                        }
                        $loc.i = $next8; // // line 5: //   sleep(.5) //   ^ //
                        $currLineNo = 5;
                        $currColNo = 2;

                        var $loadname9 = $loc.sleep !== undefined ? $loc.sleep : Sk.misceval.loadname("sleep", $gbl);
                        $ret = $loadname9.tp$call ? $loadname9.tp$call([$scope0.$const10], undefined) : Sk.misceval.applyOrSuspend($loadname9, undefined, undefined, undefined, [$scope0.$const10]);
                        $blk = 7; /* allowing case fallthrough */
                    case 7:
                        /* --- function return or resume suspension --- */ if ($ret && $ret.$isSuspension) {
                            return $saveSuspension($ret, "<stdin>.py", 5, 2);
                        }
                        var $call11 = $ret; // // line 5: //   sleep(.5) //   ^ //
                        $currLineNo = 5;
                        $currColNo = 2; // // line 6: //   x += i //   ^ //

                        $currLineNo = 6;
                        $currColNo = 2;

                        var $loadname12 = $loc.x !== undefined ? $loc.x : Sk.misceval.loadname("x", $gbl);
                        var $loadname13 = $loc.i !== undefined ? $loc.i : Sk.misceval.loadname("i", $gbl);
                        var $inplbinop14 = Sk.abstr.numberInplaceBinOp($loadname12, $loadname13, "Add");
                        $loc.x = $inplbinop14;
                        $blk = 2; /* jump */
                        continue;
                    case 3:
                        /* --- for cleanup --- */ $blk = 4; /* allowing case fallthrough */
                    case 4 /* --- for end --- */: // // line 8: // print(x) // ^ //
                        $currLineNo = 8;
                        $currColNo = 0;

                        var $loadname15 = $loc.print !== undefined ? $loc.print : Sk.misceval.loadname("print", $gbl);
                        var $loadname16 = $loc.x !== undefined ? $loc.x : Sk.misceval.loadname("x", $gbl);
                        $ret = $loadname15.tp$call ? $loadname15.tp$call([$loadname16], undefined) : Sk.misceval.applyOrSuspend($loadname15, undefined, undefined, undefined, [$loadname16]);
                        $blk = 8; /* allowing case fallthrough */
                    case 8:
                        /* --- function return or resume suspension --- */ if ($ret && $ret.$isSuspension) {
                            return $saveSuspension($ret, "<stdin>.py", 8, 0);
                        }
                        var $call17 = $ret; // // line 8: // print(x) // ^ //
                        $currLineNo = 8;
                        $currColNo = 0;

                        return $loc;
                        throw new Sk.builtin.SystemError("internal error: unterminated block");
                }
            } catch (err) {
                if (!(err instanceof Sk.builtin.BaseException)) {
                    err = new Sk.builtin.ExternalError(err);
                }
                err.traceback.push({
                    lineno: $currLineNo,
                    colno: $currColNo,
                    filename: "<stdin>.py",
                });
                if ($exc.length > 0) {
                    $err = err;
                    $blk = $exc.pop();
                    continue;
                } else {
                    throw err;
                }
            }
        }
    };
    $scope0.$const3 = new Sk.builtin.int_(0);
    $scope0.$const5 = new Sk.builtin.int_(4);
    $scope0.$const10 = new Sk.builtin.float_(0.5);
    return $scope0;
})();
