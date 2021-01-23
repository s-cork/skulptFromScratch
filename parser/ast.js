const PyCF_ONLY_AST = 0x0400;
const PyCF_TYPE_COMMENTS = 0x1000;

export function parse(source, filename = "<unknown>", mode = "exec", type_comments = false) {
    /*
    Parse the source into an AST node.
    Equivalent to compile(source, filename, mode, PyCF_ONLY_AST).
    Pass type_comments=True to get back type comments where the syntax allows.
    */
    let flags = PyCF_ONLY_AST;
    if (type_comments) flags |= PyCF_TYPE_COMMENTS;
    return compile(source, filename, mode, flags);
}

export function unparse() {}


export class Expression {
    constructor(body) {
        this.body = body;
    }
}

export class _Py_BinOp {
    constructor(a, op, b, lineno, col_offset, end_lineno, end_col_offset) {
        this.left = a;
        this.op = op;
        this.right = b;
        this.lineno = lineno;
        this.col_offset = col_offset;
        this.end_lineno = end_lineno;
        this.end_col_offset = end_col_offset;
    }
}

export class Add{}