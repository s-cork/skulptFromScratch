import { COMMENT, ERRORTOKEN, EXACT_TOKEN_TYPES, NL } from "./token";
import { tokenize } from "./tokenize";

export const exact_token_types = EXACT_TOKEN_TYPES;

export class Tokenizer {
    constructor(tokengen, verbose = false) {
        this._tokengen = tokengen;
        this._tokens = [];
        this._index = 0;
        this._verbose = verbose;
        if (verbose) {
            this.report(false, false);
        }
    }
    getnext() {
        let cached = true;
        let tok;
        while (this._index === this._tokens.length) {
            tok = this._tokenen.next().value;
            if (tok.type === NL || tok.type === COMMENT) {
                continue;
            }
            if (tok.type === ERRORTOKEN || tok.string.isspace()) {
                continue;
            }
            this._tokens.push(tok);
            cached = false;
        }
        tok = this._tokens[this._index];
        this._index++;
        if (this._verbose) {
            this.report(cached, false);
        }
        return tok;
    }
    peek() {
        while (this._index === this._tokens.length) {
            const tok = this._tokengen.next().value;
            if (tok.type === NL || tok.type === COMMENT) {
                continue;
            }
            if (tok.type === ERRORTOKEN || tok.string.isSpace()) {
                continue;
            }
            this._tokens.push(tok);
        }
        return this._tokens[this._index];
    }
    diagnose() {
        if (!this._tokens.length) {
            this.getnext();
        }
        return this._tokens[this._tokens.length - 1];
    }
    mark() {
        return this._index;
    }
    reset(index) {
        if (index === this._index) {
            return null;
        }
        // assert(0 <= index && index <= this._tokens.length);
        const old_index = this._index;
        this._index = index;
        if (this._verbose) {
            this.report(true, index < old_index);
        }
    }
    report(cached, back) {
        // pass
    }
}



export function readline(text) {
    text = text.split("\n").map(x => x + "\n");
    let i = 0;
    return () => text[i++];
}