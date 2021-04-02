/*     1 */ Sk.execStart = Sk.lastYield = new Date();
/*     2 */ $compiledmod = function() {
/*     3 */     var $scope0 = (function($forcegbl) {
/*     4 */         var $wakeFromSuspension = function() {
/*     5 */             var susp = $scope0.$wakingSuspension;
/*     6 */             $scope0.$wakingSuspension = undefined;
/*     7 */             $blk = susp.$blk;
/*     8 */             $loc = susp.$loc;
/*     9 */             $gbl = susp.$gbl;
/*    10 */             $exc = susp.$exc;
/*    11 */             $err = susp.$err;
/*    12 */             $postfinally = susp.$postfinally;
/*    13 */             $currLineNo = susp.$lineno;
/*    14 */             $currColNo = susp.$colno;
/*    15 */             Sk.lastYield = Date.now();
/*    16 */             try {
/*    17 */                 $ret = susp.child.resume();
/*    18 */             } catch (err) {
/*    19 */                 if (err instanceof Sk.misceval.Suspension) {
/*    20 */                     $saveSuspension($ret, < stdin > .py, $currLineNo, $currColNo);
/*    21 */                 } else if (!(err instanceof Sk.builtin.BaseException)) {
/*    22 */                     err = new Sk.builtin.ExternalError(err);
/*    23 */                 }
/*    24 */                 err.traceback.push({
/*    25 */                     lineno: $currLineNo,
/*    26 */                     colno: $currColNo,
/*    27 */                     filename: '<stdin>.py'
/*    28 */                 });
/*    29 */                 if ($exc.length > 0) {
/*    30 */                     $err = err;
/*    31 */                     $blk = $exc.pop();
/*    32 */                 } else {
/*    33 */                     throw err;
/*    34 */                 }
/*    35 */             }
/*    36 */         };
/*    37 */         var $saveSuspension = function($child, $filename, $lineno, $colno) {
/*    38 */             var susp = new Sk.misceval.Suspension();
/*    39 */             susp.child = $child;
/*    40 */             susp.resume = function() {
/*    41 */                 $scope0.$wakingSuspension = susp;
/*    42 */                 return $scope0();
/*    43 */             };
/*    44 */             susp.data = susp.child.data;
/*    45 */             susp.$blk = $blk;
/*    46 */             susp.$loc = $loc;
/*    47 */             susp.$gbl = $gbl;
/*    48 */             susp.$exc = $exc;
/*    49 */             susp.$err = $err;
/*    50 */             susp.$postfinally = $postfinally;
/*    51 */             susp.$filename = $filename;
/*    52 */             susp.$lineno = $lineno;
/*    53 */             susp.$colno = $colno;
/*    54 */             susp.optional = susp.child.optional;
/*    55 */             susp.$tmps = {};
/*    56 */             throw susp;
/*    57 */         };
/*    58 */         var $gbl = $forcegbl || {},
/*    59 */             $blk = 0,
/*    60 */             $exc = [],
/*    61 */             $loc = $gbl,
/*    62 */             $cell = {},
/*    63 */             $err = undefined;
/*    64 */         $loc.__file__ = new Sk.builtins.str('<stdin>.py');
/*    65 */         var $ret = undefined,
/*    66 */             $postfinally = undefined,
/*    67 */             $currLineNo = undefined,
/*    68 */             $currColNo = undefined;
/*    69 */         if (typeof Sk.execStart === 'undefined') {
/*    70 */             Sk.execStart = Date.now()
/*    71 */         }
/*    72 */         if (typeof Sk.lastYield === 'undefined') {
/*    73 */             Sk.lastYield = Date.now()
/*    74 */         }
/*    75 */         if ($scope0.$wakingSuspension !== undefined) {
/*    76 */             $wakeFromSuspension();
/*    77 */         }
/*    78 */         if (Sk.retainGlobals) {
/*    79 */             if (Sk.globals) {
/*    80 */                 $gbl = Sk.globals;
/*    81 */                 Sk.globals = $gbl;
/*    82 */                 $loc = $gbl;
/*    83 */             }
/*    84 */             if (Sk.globals) {
/*    85 */                 $gbl = Sk.globals;
/*    86 */                 Sk.globals = $gbl;
/*    87 */                 $loc = $gbl;
/*    88 */                 $loc.__file__ = new Sk.builtins.str('<stdin>.py');
/*    89 */             } else {
/*    90 */                 Sk.globals = $gbl;
/*    91 */             }
/*    92 */         } else {
/*    93 */             Sk.globals = $gbl;
/*    94 */         }
/*    95 */         while (true) {
/*    96 */             try {
/*    97 */                 var $dateNow = Date.now();
/*    98 */                 if ($dateNow - Sk.execStart > Sk.execLimit) {
/*    99 */                     throw new Sk.builtin.TimeLimitError(Sk.timeoutMsg())
/*   100 */                 }
/*   101 */                 if ($dateNow - Sk.lastYield > Sk.yieldLimit) {
/*   102 */                     var $susp = $saveSuspension({
/*   103 */                         data: {
/*   104 */                             type: 'Sk.yield'
/*   105 */                         },
/*   106 */          