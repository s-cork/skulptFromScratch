export const tp$init: unique symbol = Symbol("tp$init");
export const tp$new: unique symbol = Symbol("tp$new");
export const tp$dict: unique symbol = Symbol("tp$dict");
export const tp$iter = Symbol.iterator;
export const tp$iternext = "next";
export const tp$call: unique symbol = Symbol("tp$call");
export const tp$getattr: unique symbol = Symbol("tp$getattr");
export const tp$setattr: unique symbol = Symbol("tp$setattr");
export const tp$repr: unique symbol = Symbol("tp$repr");
export const tp$str: unique symbol = Symbol("tp$str");
export const tp$flags: unique symbol = Symbol("tp$flags");
export const tp$hash: unique symbol = Symbol("tp$hash");
export const tp$unhashable: unique symbol = Symbol("tp$unhashable");
export const tp$getsets: unique symbol = Symbol("tp$getsets");
export const tp$methods: unique symbol = Symbol("tp$methods");
export const tp$slots: unique symbol = Symbol("tp$slots");
export const tp$mro: unique symbol = Symbol("tp$mro");
export const tp$base: unique symbol = Symbol("tp$base");
export const tp$bases: unique symbol = Symbol("tp$bases");
export const tp$descr_get: unique symbol = Symbol("tp$descr_get");
export const tp$descr_set: unique symbol = Symbol("tp$descr_set");
export const tp$ready: unique symbol = Symbol("tp$ready");
export const tp$name: unique symbol = Symbol("tp$name");
export const tp$doc: unique symbol = Symbol("tp$doc");

export const tp$richcompare: unique symbol = Symbol("tp$richcompare");
export const ob$eq: unique symbol = Symbol("Eq");
export const ob$ne: unique symbol = Symbol("NotEq");
export const ob$ge: unique symbol = Symbol("GtE");
export const ob$le: unique symbol = Symbol("LtE");
export const ob$gt: unique symbol = Symbol("Gt");
export const ob$lt: unique symbol = Symbol("Lt");
export const ob$is: unique symbol = Symbol("Is");

export const ob$susp_safe: unique symbol = Symbol("SuspensionSafe");
// suspension safe flags
export const ss$iter: unique symbol = Symbol("SuspensionSafeIter");
export const ss$call: unique symbol = Symbol("SuspensionSafeIter");
export const ss$bool: unique symbol = Symbol("SuspensionSafeIter");
export const ss$contains: unique symbol = Symbol("SuspensionSafeIter");
export const ss$len: unique symbol = Symbol("SuspensionSafeIter");
export const ss$getattr: unique symbol = Symbol("SuspensionSafeIter");
export const ss$setattr: unique symbol = Symbol("SuspensionSafeIter");
export const ss$getitem: unique symbol = Symbol("SuspensionSafeIter");
export const ss$setitem: unique symbol = Symbol("SuspensionSafeIter");


export const mp$subscript: unique symbol = Symbol("mp$subscript");
export const mp$ass_subscript: unique symbol = Symbol("mp$ass_subscript");

export const sq$length: unique symbol = Symbol("sq$length");
export const sq$contains: unique symbol = Symbol("sq$contains");
export const sq$concat: unique symbol = Symbol("sq$concat");
export const sq$repeat: unique symbol = Symbol("sq$repeat");

export const nb$index: unique symbol = Symbol("nb$index");
export const nb$int: unique symbol = Symbol("nb$int");
export const nb$float: unique symbol = Symbol("nb$float");
export const nb$bool: unique symbol = Symbol("nb$bool");
export const nb$abs: unique symbol = Symbol("nb$abs");
export const nb$pos: unique symbol = Symbol("nb$pos");
export const nb$neg: unique symbol = Symbol("nb$neg");
export const nb$add: unique symbol = Symbol("nb$add");
export const nb$radd: unique symbol = Symbol("nb$radd");
export const nb$iadd: unique symbol = Symbol("nb$iadd");
export const nb$sub: unique symbol = Symbol("nb$sub");
export const nb$rsub: unique symbol = Symbol("nb$rsub");
export const nb$isub: unique symbol = Symbol("nb$isub");
export const nb$div: unique symbol = Symbol("nb$div");
export const nb$rdiv: unique symbol = Symbol("nb$rdiv");
export const nb$idiv: unique symbol = Symbol("nb$idiv");
export const nb$mul: unique symbol = Symbol("nb$mul");
export const nb$rmul: unique symbol = Symbol("nb$rmul");
export const nb$imul: unique symbol = Symbol("nb$imul");
export const nb$floordiv: unique symbol = Symbol("nb$floordiv");
export const nb$rfloordiv: unique symbol = Symbol("nb$rfloordiv");
export const nb$ifloordiv: unique symbol = Symbol("nb$ifloordiv");
export const nb$divmod: unique symbol = Symbol("nb$divmod");
export const nb$rdivmod: unique symbol = Symbol("nb$rdivmod");
export const nb$idivmod: unique symbol = Symbol("nb$idivmod");

export const nb$matmul: unique symbol = Symbol("nb$matmul")
export const nb$rmatmul: unique symbol = Symbol("nb$rmatmul")
export const nb$imatmul: unique symbol = Symbol("nb$imatmul")
export const nb$mod: unique symbol = Symbol("nb$mod")
export const nb$rmod: unique symbol = Symbol("nb$rmod")
export const nb$imod: unique symbol = Symbol("nb$imod")
export const nb$pow: unique symbol = Symbol("nb$pow")
export const nb$rpow: unique symbol = Symbol("nb$rpow")
export const nb$ipow: unique symbol = Symbol("nb$ipow")
export const nb$lshift: unique symbol = Symbol("nb$lshift")
export const nb$rlshift: unique symbol = Symbol("nb$rlshift")
export const nb$ilshift: unique symbol = Symbol("nb$ilshift")
export const nb$rshift: unique symbol = Symbol("nb$rshift")
export const nb$ishift: unique symbol = Symbol("nb$ishift")
export const nb$rrshift: unique symbol = Symbol("nb$rrshift")
export const nb$and: unique symbol = Symbol("nb$and")
export const nb$rand: unique symbol = Symbol("nb$rand")
export const nb$iand: unique symbol = Symbol("nb$iand")
export const nb$or: unique symbol = Symbol("nb$or")
export const nb$ror: unique symbol = Symbol("nb$ror")
export const nb$ior: unique symbol = Symbol("nb$ior")
export const nb$xor: unique symbol = Symbol("nb$xor")
export const nb$rxor: unique symbol = Symbol("nb$rxor")
export const nb$ixor: unique symbol = Symbol("nb$ixor")
export const nb$invert: unique symbol = Symbol("nb$invert")

export const ob$type: unique symbol = Symbol("ob$type");

export const tp$lookup: unique symbol = Symbol("tp$lookup");

