import { generate_tokens } from "./tokenize";

export class Parser {
    constructor(grammar) {
        this.grammar = grammar;
    }
}

const _targets = {
    exec: true,
    eval: true,
    single: true,
};

export class CompileInfo {
    constructor(filename, mode = "exec", flags = 0) {
        this.filename = filename;
        this.mode = mode;
        this.encoding = null;
        this.flags = flags;
    }
}

export class PythonParser extends Parser {
    constructor(grammar = pygram.pythonGrammar) {
        super(grammar);
    }
    parse_source(text_src, compile_info) {
        // deal with encodings
        return this._parse(text_src, compile_info);
    }
    _parse(text_src, compile_info) {
        const flags = compile_info.flags;
        const lines = text_src.split("\n").map((line) => line + "\n");
        this.prepare(_targets[compile_info.mode]);
        let tokens, tree;
        try {
            try {
                tokens = generate_tokens(lines, flags);
            } catch (e) {
                if (e instanceof TokenError) {
                    e.filename = compile_info.filename;
                } else if (e instanceof TokenIndentError) {
                    e.filename = compile_info.filename;
                }
                throw e;
            }
            try {
                for (let token of tokens) {
                    if (this.add_token(token)) {
                        break;
                    }
                }
                tree = this.root;
            } catch (e) {
                if (e instanceof ParseError) {
                    // tidy up the error and reraise
                    throw e;
                }
            }
        } finally {
            this.root = null;
        }
        return tree;
    }
}
