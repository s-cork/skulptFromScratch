export class Grammar {
    constructor() {
        this.symbolIds = {};
        this.symbolNames = {};
        this.symbolToLabel = {};
        this.keywordIds = {};
        this.tokenToErrString = {};
        this.dfas = [];
        this.labels = [0];
        this.tokenIds = {};
        this.start = -1;
    }
    classify(token) {
        let labelIndex;
        if (token.tokenType === this.KEYWORD_TOKEN) {
            labelIndex = this.keywordIds[token.value];
            if (labelIndex !== undefined) {
                return labelIndex;
            }
        }
        labelIndex = this.tokenIds[token.tokenType];
        if (labelIndex === undefined) {
            throw new ParseError("invalid token", token);
        }
        return labelIndex;
    }
}


export class DFA {
    constructor(symbolId, states, first) {
        this.symbolId = symbolId;
        this.states = states;
        this.first = first;
    }
    couldMatchToken(labelIndex) {
        const pos = labelIndex >> 3;
        const bit = 1 << (labelIndex & 0b111);
        return Boolean(this.first[labelIndex >> 3].charCodeAt(0) & bit);
    }
    static _firstToString(first) {
        // todo
    }
}


export class Parser {
    constructor(grammar) {
        this.grammar = grammar;
    }
    pepare(start = -1) {
        if (start === -1) {
            start = this.grammar.start;
        }
        this.root = null;
        this.stack = new StackEntry(null, this.grammar.dfas[start - 256], 0);
    }
    add_token(token) {
        const labelIndex = this.grammar.classify(token);
        let symId = 0;
        while (true) {
            let dfa = this.stack.dfa;
            let stateIndex = this.stack.state;
            const states = dfa.states;
            const [arcs, isAccepting] = states[stateIndex];
            let state;
            let arcFound = false;
            for (let [i, nextState] of arcs) {
                symId = this.grammar.labels[i];
                if (labelIndex === i) {
                    this.shift(nextState, token);
                    state = states[nextState];
                    while (state[1] && !state[0]) {
                        this.pop();
                        if (this.stack === null) {
                            return true;
                        }
                        dfa = this.stack.dfa;
                        stateIndex = self.stack.state;
                        state = dfa.states[state_index];
                    }
                    return false;
                } else if (symId > 256) {
                    const subNodeDfa = this.grammar.dfas[symId - 256];
                    if (subNodeDfa.couldMatchToken(labelIndex)) {
                        this.push(subNodeDfa, nextState, symId);
                        arcFound = true;
                        break;
                    }
                }
            }
            if (!arcFound) {
                if (isAccepting) {
                    this.pop();
                    if (this.stack === null) {
                        throw new ParseError("too much input", token);
                    }
                } else {
                    let expected, expectedStr;
                    if (arcs.length === 1) {
                        expected = symId;
                        expectedStr = this.grammar.tokenToErrString[arcs[0][0]] || "";
                    } else {
                        expected = -1;
                        expectedStr = "";
                    }
                    throw new ParseError("bad input", token, expected, expectedStr);
                }
            }
        }
    }
    shift(nextState, token) {
        const newNode = Terminal.fromtoken(token);
        this.stack.nodeAppendChild(newNode);
        this.stact.state = nextState;
    }
    push(nextDfa, nextState, nodeType) {
        this.stack.state = nextState;
        this.stack = this.stack.push(nextDfa, 0);
    }
    pop() {
        const top = this.stack;
        this.stack = top.pop();
        const node = top.node;
        // assert(node !== null);
        if (this.stack.length) {
            this.stack.nodeAppendChild(node);
        } else {
            this.root = node;
        }
    }
}
