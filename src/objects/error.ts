import { objectRepr } from "../../abstract/objectHelpers";
import { buildNativeClass, generic, getset_descriptor, method_descriptor } from "../util/class_decorators";
import { tp$getattr, tp$init, tp$name, tp$new, tp$repr, tp$str } from "../util/symbols";
import { pyDict } from "./dict";
import { pyList } from "./list";
import { pyNone } from "./nonetype";
import { pyObject } from "./object";
import { pyStr } from "./str";
import { pyTuple } from "./tuple";
import { pyType } from "./type";

@buildNativeClass("traceback", "TracebackType(tb_next, tb_frame, tb_lasti, tb_lineno)\n--\n\nCreate a new traceback object.")
export class pyTraceback extends pyObject {
    constructor(tb_next, tb_frame, tb_lasti, tb_lineno) {
        super();
    }

    [tp$new](args: Args, kws?: Kwargs): pyTraceback { }

    @generic
    [tp$getattr];

    @method_descriptor({}, null, null)
    __dir__(...args: unknown): unknown {
        return pyNone;
    }
    @getset_descriptor(null)
    get tb_frame(): unknown {
        return this.$tb_frame || pyNone;
    }
    set tb_frame(val: unknown) {
        this.$tb_frame = val;
    }

    @getset_descriptor(null)
    get tb_lasti(): unknown {
        return this.$tb_lasti || pyNone;
    }
    set tb_lasti(val: unknown) {
        this.$tb_lasti = val;
    }

    @getset_descriptor(null)
    get tb_lineno(): unknown {
        return this.$tb_lineno || pyNone;
    }
    set tb_lineno(val: unknown) {
        this.$tb_lineno = val;
    }

    @getset_descriptor(null)
    get tb_next(): unknown {
        return this.$tb_next || pyNone;
    }
    set tb_next(val: unknown) {
        this.$tb_next = val;
    }
}

@buildNativeClass("BaseException", "Common base class for all exceptions")
export class pyBaseException extends pyObject {
    protected $args: pyTuple;
    protected $tb: pyTuple<pyObject[]>;
    protected $d: pyDict;

    constructor(msg?: string) {
        super();
        this.$args = msg ? new pyTuple([new pyStr(msg)]) : new pyTuple([]);
        this.$d = new pyDict([]);
        this.$tb = new pyTraceback();
    }

    toString(): string {
        const tb = this.$tb.valueOf();
        let lineno: string;
        if (tb.length !== 0) {
            lineno = "on line " + tb[0].tb_lineno.toString();
        } else {
            lineno = "at <unknown>";
        }
        return `${this[tp$name]}: ${this[tp$str]().toString()} ${lineno}`;
    }

    [tp$new](args: Args, kws?: Kwargs): pyBaseException { }


    [tp$repr](): pyStr {
        return new pyStr(
            `${this[tp$name]}: ${this.$args
                .valueOf()
                .map((x) => objectRepr(x))
                .join(", ")}`
        );
    }

    [tp$str](): pyStr {
        return new pyStr(
            this.$args
                .valueOf()
                .map((x) => objectRepr(x))
                .join(", ")
        );
    }

    @generic
    [tp$getattr];

    [tp$setattr]() {}

    [tp$init](args: Args, kws?: Kwargs): void {}

    @method_descriptor({}, null, null)
    __reduce__(...args: unknown): unknown {
        return pyNone;
    }

    @method_descriptor({}, null, null)
    __setstate__(...args: unknown): unknown {
        return pyNone;
    }

    @method_descriptor({}, "Exception.with_traceback(tb) --\n    set self.__traceback__ to tb and return self.", null)
    with_traceback(...args: unknown): unknown {
        return pyNone;
    }
    @getset_descriptor(null)
    get __suppress_context__(): unknown {
        return this.$__suppress_context__ || pyNone;
    }
    set __suppress_context__(val: unknown) {
        this.$__suppress_context__ = val;
    }

    @getset_descriptor(null)
    get __dict__(): unknown {
        return this.$__dict__ || pyNone;
    }
    set __dict__(val: unknown) {
        this.$__dict__ = val;
    }

    @getset_descriptor(null)
    get args(): unknown {
        return this.$args || pyNone;
    }
    set args(val: unknown) {
        this.$args = val;
    }

    @getset_descriptor(null)
    get __traceback__(): unknown {
        return this.$__traceback__ || pyNone;
    }
    set __traceback__(val: unknown) {
        this.$__traceback__ = val;
    }

    @getset_descriptor("exception context")
    get __context__(): unknown {
        return this.$__context__ || pyNone;
    }
    set __context__(val: unknown) {
        this.$__context__ = val;
    }

    @getset_descriptor("exception cause")
    get __cause__(): unknown {
        return this.$__cause__ || pyNone;
    }
    set __cause__(val: unknown) {
        this.$__cause__ = val;
    }
}


@buildNativeClass('Exception', 'Common base class for all non-exit exceptions.')
export class pyException extends pyBaseException {
    constructor(msg?: string) {
        super(msg);
    }

    [tp$new](args: Args, kws?: Kwargs): pyException { }

    [tp$init](args: Args, kws?: Kwargs): void { }

}

@buildNativeClass('TypeError', 'Inappropriate argument type.')
export class pyTypeError extends pyException {
    constructor(msg?: string) {
        super(msg);
    }

    [tp$new](args: Args, kws?: Kwargs): pyTypeError { }

    [tp$init](args: Args, kws?: Kwargs): void { }

}



@buildNativeClass('SyntaxError', 'Invalid syntax.')
export class pySyntaxError extends pyException {
    constructor() {
        super();
    }

    [tp$str](): pyStr { }

    [tp$init](args: Args, kws?: Kwargs): void { }

    @getset_descriptor('exception msg')
    get msg(): unknown {
        return this.$msg || pyNone;
    }
    set msg(val: unknown) {
        this.$msg = val;
    }

    @getset_descriptor('exception filename')
    get filename(): unknown {
        return this.$filename || pyNone;
    }
    set filename(val: unknown) {
        this.$filename = val;
    }

    @getset_descriptor('exception lineno')
    get lineno(): unknown {
        return this.$lineno || pyNone;
    }
    set lineno(val: unknown) {
        this.$lineno = val;
    }

    @getset_descriptor('exception offset')
    get offset(): unknown {
        return this.$offset || pyNone;
    }
    set offset(val: unknown) {
        this.$offset = val;
    }

    @getset_descriptor('exception text')
    get text(): unknown {
        return this.$text || pyNone;
    }
    set text(val: unknown) {
        this.$text = val;
    }

    @getset_descriptor('exception print_file_and_line')
    get print_file_and_line(): unknown {
        return this.$print_file_and_line || pyNone;
    }
    set print_file_and_line(val: unknown) {
        this.$print_file_and_line = val;
    }
}
