import { tp$new, tp$repr, tp$hash, tp$richcompare, tp$getsets } from "../util/symbols";

import { pyObject } from "./object";

export class pyCode extends pyObject {
    constructor(
        argcount,
        posonlyargcount,
        kwonlyargcount,
        nlocals,
        stacksize,
        flags,
        code,
        consts,
        names,
        varnames,
        freevars,
        cellvars,
        filename,
        name,
        firstlineno,
        lnotab
    ) {
        super();
        this.argcount = argcount;
        this.posonlyargcount = posonlyargcount;
        this.kwonlyargcount = kwonlyargcount;
        this.nlocals = nlocals;
        this.stacksize = stacksize;
        this.flags = flags;
        this.code = code;
        this.consts = consts;
        this.names = names;
        this.varnames = varnames;
        this.freevars = freevars;
        this.cellvars = cellvars;
        this.filename = filename;
        this.name = name;
        this.firstlineno = firstlineno;
        this.lnotab = lnotab;
    }
    [tp$new](args, kws) {}
    [tp$hash]() {}
    [tp$repr]() {}
    [tp$richcompare](other, op) {}
    static [tp$getsets] = Object.fromEntries(
        [
            "argcount",
            "posonlyargcount",
            "kwonlyargcount",
            "nlocals",
            "stacksize",
            "flags",
            "code",
            "consts",
            "names",
            "varnames",
            "freevars",
            "cellvars",
            "filename",
            "name",
            "firstlineno",
            "lnotab",
        ].map((x) => [
            x,
            {
                $get() {
                    return toPy(this[x]);
                },
            },
        ])
    );
}
