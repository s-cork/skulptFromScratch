import { getPositionOfLineAndCharacter } from "../../.yarn/cache/typescript-patch-7a9e6321b3-017af99214.zip/node_modules/typescript/lib/typescript";
import { buildNativeClass, generic, getset_descriptor, method_descriptor, number_slots } from "../util/class_decorators";
import {
    nb$invert,
    nb$neg,
    nb$pos,
    nb$abs,
    nb$add,
    nb$and,
    nb$bool,
    nb$div,
    nb$float,
    nb$floordiv,
    nb$index,
    nb$int,
    nb$mod,
    nb$mul,
    nb$or,
    nb$sub,
    nb$xor,
    ob$is,
    ob$type,
    tp$getattr,
    tp$hash,
    tp$repr,
    tp$richcompare,
    nb$lshift,
    nb$rshift,
    tp$setattr,
    tp$str,
} from "../util/symbols";
import { pyBool, pyFalse, pyTrue } from "./bool";
import { pyTypeError } from "./error";
import { pyNotImplemented, pyNotImplementedType } from "./nonetype";
import { pyObject } from "./object";
import { richCompareOp } from "./pyinterface";
import { pyStr } from "./str";

export interface pyInt {
    $v: number | bigint;
}

@buildNativeClass(
    "int",
    "int(x=0) -> integer\nint(x, base=10) -> integer\n\nConvert a number or string to an integer, or return 0 if no arguments\nare given.  If x is a number, return x.__int__().  For floating point\nnumbers, this truncates towards zero.\n\nIf x is not a number or if base is given, then x must be a string,\nbytes, or bytearray instance representing an integer literal in the\ngiven base.  The literal can be preceded by '+' or '-' and be surrounded\nby whitespace.  The base defaults to 10.  Valid bases are 0 and 2-36.\nBase 0 means to interpret the base from the string as an integer literal.\n>>> int('0b100', base=0)\n4"
)
export class pyInt extends pyObject {
    constructor(obj?: any) {
        super();
        const type = typeof obj;
        switch (type) {
            case "number":
            case "bigint":
                this.$v = obj;
                break;
            case "undefined":
                this.$v = 0;
                break;
            case "object":
                if (obj[nb$int] !== undefined) {
                    return obj[nb$int]() as pyInt;
                }
            default:
                throw new pyTypeError("fail");
        }
    }
    toString(): string {
        return this.$v.toString();
    }
    valueOf(): number | bigint | boolean {
        return this.$v;
    }
    [tp$repr]() {
        return new pyStr(this.$v.toString());
    }
    [tp$hash]() {
        const v = this.$v;
        return typeof v === "number" ? v : Number(v % __MAX_SAFE);
    }

    @generic
    [tp$getattr]: (attr: pyStr, canSuspend?: boolean) => pyObject | undefined;

    [tp$richcompare](other: pyObject, op: richCompareOp): pyNotImplementedType | pyBool {
        if (!(other instanceof pyInt)) {
            return pyNotImplemented;
        }
        let ret: pyBool | boolean;
        switch (op) {
            case "Lt":
                ret = this.$v < other.$v;
                break;
            case "LtE":
                ret = this.$v <= other.$v;
                break;
            case "Eq":
                ret = this.$v === other.$v;
                break;
            case "NotEq":
                ret = this.$v !== other.$v;
                break;
            case "Gt":
                ret = this.$v > other.$v;
                break;
            case "GtE":
                ret = this.$v >= other.$v;
                break;
        }
        return ret ? pyTrue : pyFalse;
    }

    @number_slots
    [nb$index]() {
        return this.$v;
    }

    [nb$bool]() {
        return this.$v !== 0;
    }

    @intNumberSlot((v: any, w: any): any => v + w, true)
    [nb$add]: (other: pyObject) => pyInt | pyNotImplementedType;

    @intNumberSlot((v: any, w: any): any => v - w, true)
    [nb$sub]: (other: pyObject) => pyInt | pyNotImplementedType;

    @intNumberSlot((v: any, w: any): any => v * w, false)
    [nb$mul]: (other: pyObject) => pyInt | pyNotImplementedType;

    [nb$div](other: pyObject): pyInt | pyNotImplementedType {
        return this[nb$floordiv](other);
    }

    @intDivSlot((v: number, w: number): number => Math.floor(v / w), (v: bigint, w: bigint): bigint => bigintFloorDiv(v, w))
    [nb$floordiv]: (other: pyObject) => pyInt | pyNotImplementedType;

    @intDivSlot((v: number, w: number): number => v - Math.floor(v / w), (v: bigint, w: bigint): bigint => v - bigintFloorDiv(v, w))
    [nb$mod]: (other: pyObject) => pyInt | pyNotImplementedType;

    @intBitSlot((v: any, w: any): any => v & w)
    [nb$and]: (other: pyObject) => pyInt | pyNotImplementedType;

    @intBitSlot((v: any, w: any): any => v | w)
    [nb$or]: (other: pyObject) => pyInt | pyNotImplementedType;

    @intBitSlot((v: any, w: any): any => v ^ w)
    [nb$xor]: (other: pyObject) => pyInt | pyNotImplementedType;

    @intShiftSlot(
        (v: number, w: number): number | void => {
            if (w < 53) {
                const tmp = v * 2 * shiftConsts[w];
                if (numberOrStringWithinThreshold(tmp)) {
                    return tmp;
                }
            }
        },
        (v: bigint, w: bigint): bigint => v << w
    )
    [nb$lshift]: (other: pyObject) => pyInt | pyNotImplementedType;

    @intShiftSlot(
        (v: number, w: number): number | void => {
            const tmp = v >> w;
            if (v > 0 && tmp < 0) {
                return tmp & (Math.pow(2, 32 - w) - 1);
            }
            return tmp;
        },
        (v: bigint, w: bigint): bigint => v >> w
    )
    [nb$rshift]: (other: pyObject) => pyInt | pyNotImplementedType;

    @intUnarySlot((v: any): any => ~v)
    [nb$invert]: () => pyInt;

    @intUnarySlot((v: any): any => -v)
    [nb$neg]: () => pyInt;

    @intUnarySlot(Math.abs, (v: bigint): bigint => (v < 0n ? -v : v))
    [nb$abs]: () => pyInt;

    [nb$pos]() {
        return new pyInt(this.$v);
    }

    [nb$float]() {
        const v = this.$v;
        if (typeof v === "number") {
            return new pyFloat(v);
        }
        const x = parseFloat(v.toString());
        if (x === Infinity || x === -Infinity) {
            throw new pyOverflowError("int too large to convert to float");
        }
        return new pyFloat(x);
    }

    [ob$is](other: pyObject): boolean {
        return other.constructor === pyInt && this.constructor === pyInt && this.$v === (other as pyInt).$v;
    }

    @method_descriptor({ NoArgs: true }, "Returns self, the complex conjugate of any int.", null)
    conjugate(): pyInt {
        return new pyInt(this.$v);
    }

    @method_descriptor({}, "Number of bits necessary to represent self in binary.\n\n>>> bin(37)\n'0b100101'\n>>> (37).bit_length()\n6", "($self, /)")
    bit_length(...args: unknown): unknown {
        return pyNone;
    }

    @method_descriptor(
        {},
        "Return an array of bytes representing an integer.\n\n  length\n    Length of bytes object to use.  An OverflowError is raised if the\n    integer is not representable with the given number of bytes.\n  byteorder\n    The byte order used to represent the integer.  If byteorder is 'big',\n    the most significant byte is at the beginning of the byte array.  If\n    byteorder is 'little', the most significant byte is at the end of the\n    byte array.  To request the native byte order of the host system, use\n    `sys.byteorder' as the byte order value.\n  signed\n    Determines whether two's complement is used to represent the integer.\n    If signed is False and a negative integer is given, an OverflowError\n    is raised.",
        "($self, /, length, byteorder, *, signed=False)"
    )
    to_bytes(...args: unknown): unknown {
        return pyNone;
    }

    @method_descriptor({}, "Truncating an Integral returns itself.", null)
    __trunc__(): pyInt {
        return new pyInt(this.$v);
    }

    @method_descriptor({}, "Flooring an Integral returns itself.", null)
    __floor__(): pyInt {
        return new pyInt(this.$v);
    }

    @method_descriptor({}, "Ceiling of an Integral returns itself.", null)
    __ceil__(): pyInt {
        return new pyInt(this.$v);
    }

    @method_descriptor({}, "Rounding an Integral returns itself.\nRounding with an ndigits argument also returns an integer.", null)
    __round__(): pyInt {
        return new pyInt(this.$v);
    }

    @method_descriptor({}, null, "($self, /)")
    __getnewargs__(...args: unknown): unknown {
        return pyNone;
    }

    @method_descriptor({}, null, "($self, format_spec, /)")
    __format__(f: pyStr): pyStr {
        // @todo
        return this[tp$str]();
    }

    @method_descriptor({}, "Returns size in memory, in bytes.", "($self, /)")
    __sizeof__(...args: unknown): unknown {
        return pyNone;
    }

    @classmethod_descriptor(
        {},
        "Return the integer represented by the given array of bytes.\n\n  bytes\n    Holds the array of bytes to convert.  The argument must either\n    support the buffer protocol or be an iterable object producing bytes.\n    Bytes and bytearray are examples of built-in objects that support the\n    buffer protocol.\n  byteorder\n    The byte order used to represent the integer.  If byteorder is 'big',\n    the most significant byte is at the beginning of the byte array.  If\n    byteorder is 'little', the most significant byte is at the end of the\n    byte array.  To request the native byte order of the host system, use\n    `sys.byteorder' as the byte order value.\n  signed\n    Indicates whether two's complement is used to represent the integer.",
        "($type, /, bytes, byteorder, *, signed=False)"
    )
    from_bytes(...args: unknown): unknown {
        return pyNone;
    }

    @getset_descriptor("the real part of a complex number")
    get real() {
        return new pyInt(this.$v);
    }

    @getset_descriptor("the imaginary part of a complex number")
    get imag() {
        return new pyInt(0);
    }

    @getset_descriptor("the numerator of a rational number in lowest terms")
    get numerator(): unknown {
        return new pyInt(this.$v);
    }

    @getset_descriptor("the denominator of a rational number in lowest terms")
    get denominator(): unknown {
        return new pyInt(1);
    }
}

const __MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
const __MAX_SAFE_NEG = BigInt(-Number.MAX_SAFE_INTEGER);

function intNumberSlot(binOp: BinOpFunc, checkSafe = true) {
    return BinOpSlot(
        (v, w) => {
            const res = binOp(v, w);
            if (numberOrStringWithinThreshold(res)) {
                return new pyInt(res);
            }
        },
        checkSafe ? (v, w) => new pyInt(numberIfSafe(binOp(v, w))) : (v, w) => new pyInt(binOp(v, w))
    );
}

function intDivSlot(numberFunc: (v: number, w: number) => number, bigintFunc: (v: bigint, w: bigint) => bigint) {
    return BinOpSlot(
        (v, w) => new pyInt(numberFunc(v, w)),
        (v, w) => new pyInt(numberIfSafe(bigintFunc(v, w))),
        (_, w) => {
            if (w === 0) {
                throw new pyZeroDivisionError("integer division or modulo by zero");
            }
        }
    );
}

interface BinOpFunc {
    (v: number, w: number): number;
    (v: bigint, w: bigint): bigint;
}

function intBitSlot(bitFunc: BinOpFunc) {
    return BinOpSlot(
        (v, w) => {
            const tmp = bitFunc(v, w);
            // convert back to unsigned
            return new pyInt(tmp < 0 ? tmp + 4294967296 : tmp);
        },
        (v, w) => new pyInt(numberIfSafe(bitFunc(v, w)))
    );
}

function intShiftSlot(numberFunc: (v: number, w: number) => number | void, bigintFunc: (v: bigint, w: bigint) => bigint) {
    return BinOpSlot(
        (v, w) => {
            const tmp = numberFunc(v, w);
            if (tmp !== undefined) {
                return new pyInt(tmp);
            }
        },
        (v, w) => new pyInt(bigintFunc(v, w)),
        (v, w) => {
            if (w < 0) {
                throw new pyValueError("negative shift count");
            } else if (v === 0) {
                return new pyInt(0);
            }
        }
    );
}

function BinOpSlot(doNumber: (v: number, w: number) => pyInt | undefined, doBigInt: (v: bigint, w: bigint) => pyInt, preCheck?: (v: any, w: any) => pyInt | void) {
    return function (target: pyInt, propertyKey: symbol) {
        Object.defineProperty(target, propertyKey, {
            value(this: pyInt, other: pyObject): pyInt | pyNotImplementedType {
                if (!(other instanceof pyInt)) {
                    return pyNotImplemented;
                }
                let v = this.$v;
                let w = other.$v;
                if (preCheck !== undefined) {
                    const ret = preCheck(v, w);
                    if (ret !== undefined) {
                        return ret;
                    }
                }
                if (typeof v === "number" && typeof w === "number") {
                    const ret = doNumber(v, w);
                    if (ret !== undefined) {
                        return ret;
                    }
                }
                // fallthrough
                v = bigUp(v);
                w = bigUp(w);
                return doBigInt(v, w);
            },
            writable: true,
        });
    };
}

interface UnaryFunc {
    (v: number): number;
    (v: bigint): bigint;
}

function intUnarySlot(numberFunc: UnaryFunc | ((v: number) => number), bigintFunc?: (v: bigint) => bigint) {
    bigintFunc ||= numberFunc as UnaryFunc;
    return function (target: pyInt, propertyKey: symbol) {
        Object.defineProperty(target, propertyKey, {
            value(this: pyInt): pyInt {
                const v = this.$v;
                if (typeof v === "number") {
                    return new pyInt(numberFunc(v));
                }
                return new pyInt((bigintFunc as UnaryFunc)(v));
            },
            writable: true,
        });
    };
}

function bigintFloorDiv(v: bigint, w: bigint): bigint {
    return (v ^ w) >= 0n ? v / w : v < 0n ? (v - 1n) / w : (v + 1n) / w;
}

function bigUp(x: number | bigint): bigint {
    return typeof x === "number" ? BigInt(x) : (x as bigint);
}

function numberOrStringWithinThreshold(v: number | string): boolean {
    return v <= Number.MAX_SAFE_INTEGER && v >= -Number.MAX_SAFE_INTEGER;
}

function numberIfSafe(x: bigint): bigint | number {
    return x < __MAX_SAFE && x > __MAX_SAFE_NEG ? Number(x) : x;
}

const shiftConsts = [
    0.5,
    1,
    2,
    4,
    8,
    16,
    32,
    64,
    128,
    256,
    512,
    1024,
    2048,
    4096,
    8192,
    16384,
    32768,
    65536,
    131072,
    262144,
    524288,
    1048576,
    2097152,
    4194304,
    8388608,
    16777216,
    33554432,
    67108864,
    134217728,
    268435456,
    536870912,
    1073741824,
    2147483648,
    4294967296,
    8589934592,
    17179869184,
    34359738368,
    68719476736,
    137438953472,
    274877906944,
    549755813888,
    1099511627776,
    2199023255552,
    4398046511104,
    8796093022208,
    17592186044416,
    35184372088832,
    70368744177664,
    140737488355328,
    281474976710656,
    562949953421312,
    1125899906842624,
    2251799813685248,
    4503599627370496,
    9007199254740992,
];
