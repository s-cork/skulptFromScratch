import { pyNotImplemented } from "../src/types/nonetype";
import { pyObject } from "../src/types/object";
import { pyTypeName } from "./object";
import {
    nb$add,
    nb$reflected_add,
    nb$subtract,
    nb$reflected_subtract,
    nb$multiply,
    nb$reflected_multiply,
    nb$divide,
    nb$floor_divide,
    nb$reflected_divide,
    nb$reflected_floor_divide,
    nb$divmod,
    nb$reflected_divmod,
    nb$matrix_multiply,
    nb$reflected_matrix_multiply,
    nb$remainder,
    nb$reflected_remainder,
    nb$power,
    nb$reflected_power,
    nb$lshift,
    nb$reflected_lshift,
    nb$rshift,
    nb$reflected_rshift,
    nb$and,
    nb$reflected_and,
    nb$or,
    nb$reflected_or,
    nb$xor,
    nb$reflected_xor,
} from "../src/util/symbols";

type opname = "Add" | "Sub" | "Mult" | "MatMult" | "Div" | "FloorDiv" | "Mod" | "DivMod" | "Pow" | "LShift" | "RShift" | "BitAnd" | "BitOr" | "BitXor";

export function pyBinOp(v: pyObject, w: pyObject, op: opname): pyObject {
    const [slot, reflected, symbol] = _opToSlots[op];
    return _doBinaryOp(v, w, slot, reflected, symbol);
}

export function pyAdd(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$add, nb$reflected_add, "+");
}

export function pySub(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$subtract, nb$reflected_subtract, "-");
}

export function pyMult(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$multiply, nb$reflected_multiply, "*");
}

export function pyDiv(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$divide, nb$reflected_divide, "/");
}

export function pyFloorDiv(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$floor_divide, nb$reflected_floor_divide, "//");
}

export function pyMatMult(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$matrix_multiply, nb$reflected_matrix_multiply, "@");
}

export function pyMod(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$remainder, nb$reflected_remainder, "%");
}

export function pyDivMod(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$divmod, nb$reflected_divmod, "divmod()");
}

export function pyPow(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$power, nb$reflected_power, "** or pow()");
}

export function pyLShift(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$lshift, nb$reflected_lshift, "<<");
}

export function pyRShift(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$rshift, nb$reflected_rshift, ">>");
}

export function pyBitAnd(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$and, nb$reflected_and, "&");
}

export function pyBitOr(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$or, nb$reflected_or, "|");
}

export function pyBitXor(v: pyObject, w: pyObject) {
    return _doBinaryOp(v, w, nb$xor, nb$reflected_xor, "^");
}

function _doBinaryOp(v: pyObject, w: pyObject, slot: symbol, reflected: symbol, symbol: string): pyObject {
    // All Python inheritance is now enforced with Javascript inheritance
    // (see Sk.abstr.setUpInheritance). This checks if w's type is a strict
    // subclass of v's type
    const w_type = w.constructor;
    const v_type = v.constructor;
    const w_is_subclass = w_type !== v_type && w instanceof v_type;

    // From the Python 2.7 docs:
    //
    // "If the right operand’s type is a subclass of the left operand’s type and
    // that subclass provides the reflected method for the operation, this
    // method will be called before the left operand’s non-reflected method.
    // This behavior allows subclasses to override their ancestors’ operations."
    //
    // -- https://docs.python.org/2/reference/datamodel.html#index-92

    let ret;
    if (w_is_subclass) {
        const wslot = w[reflected];
        // only use the reflected slot if it has actually been overridden
        if (wslot !== undefined && wslot !== v[reflected]) {
            ret = wslot.call(w, v);
            if (ret !== pyNotImplemented) {
                return ret;
            }
        }
    }

    const vslot = v[slot];
    if (vslot !== undefined) {
        ret = vslot.call(v: pyObject, w: pyObject);
        if (ret !== pyNotImplemented) {
            return ret;
        }
    }
    // Don't retry RHS if failed above
    if (!w_is_subclass) {
        const wslot = w[reflected];
        // only use the reflected slot if it has actually been overridden
        if (wslot !== undefined) {
            ret = wslot.call(w, v);
            if (ret !== pyNotImplemented) {
                return ret;
            }
        }
    }

    _binaryTypeError(v, w, symbol);
}

function _binaryTypeError(v, w, symbol: string): never {
    const vtypename = pyTypeName(v);
    const wtypename = pyTypeName(w);
    throw new pyExc.TypeError("unsupported operand type(s) for " + symbol + ": '" + vtypename + "' and '" + wtypename + "'");
}

interface slotinfo {
    [index: string]: [symbol, symbol, string];
}

const _opToSlots: slotinfo = {
    Add: [nb$add, nb$reflected_add, "+"],
    Sub: [nb$subtract, nb$reflected_subtract, "-"],
    Mult: [nb$multiply, nb$reflected_multiply, "*"],
    MatMult: [nb$matrix_multiply, nb$reflected_matrix_multiply, "@"],
    Div: [nb$divide, nb$reflected_divide, "/"],
    FloorDiv: [nb$floor_divide, nb$reflected_floor_divide, "//"],
    Mod: [nb$remainder, nb$reflected_remainder, "%"],
    DivMod: [nb$divmod, nb$reflected_divmod, "divmod()"],
    Pow: [nb$power, nb$reflected_power, "** or pow()"],
    LShift: [nb$lshift, nb$reflected_lshift, "<<"],
    RShift: [nb$rshift, nb$reflected_rshift, ">>"],
    BitAnd: [nb$and, nb$reflected_and, "&"],
    BitOr: [nb$or, nb$reflected_or, "|"],
    BitXor: [nb$xor, nb$reflected_xor, "^"],
};
