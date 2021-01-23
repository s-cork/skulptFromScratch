class GrammarError extends Error {
    name = "GrammarError";
}

class NotImplementedError extends Error {
    name = "NotImplementedError";
}

class GrammarVisitor {
    visit(node, ...args) {
        const method = "visit_" + node.name;
        return this[method].genericVisit(node, ...args);
    }
    genericVisit(node, ...args) {
        for (let i in node) {
            const value = node[i];
            if (Array.isArray(value)) {
                value.forEach((item) => this.visit(item, ...args));
            } else {
                this.visit(value, ...args);
            }
        }
    }
}

class Grammar {
    constructor(rules, metas) {
        this.rules = {};
        for (let rule of rules) {
            this.rules[rule.name] = rule;
        }
        this.metas = Object.fromEntries(metas);
    }
    toString() {
        return Object.values(this.rules).joint("\n");
    }
    [Symbol.iterator]() {
        return Object.values(this.rules)[Symbol.iterator]();
    }
}

const SIMPLE_STR = true;

class Rule {
    constructor(name, type, rhs, memo = null) {
        this.name = name;
        this.type = type;
        this.rhs = rhs;
        this.memo = !!memo;
        this.visited = false;
        this.nullable = false;
        this.leftRucursive = false;
        this.leader = false;
    }
    isLoop() {
        return this.name.startsWith("_loop");
    }
    isGather() {
        return this.name.startsWith("_gather");
    }
    *[Symbol.iterator]() {
        yield this.rhs;
    }
    nullableVisit(rules) {
        if (this.visited) {
            return false;
        }
        this.visited = true;
        this.nullable = this.rhs.nullableVisit(rules);
        return this.nullable;
    }
    initialNames() {
        return this.rhs.initialNames();
    }
    flatten() {
        let rhs = this.rhs;
        if (!this.isLoop() && rhs.alts.length === 1 && rhs.alts[0].items.length === 1 && rhs.alts[0].items[0].item instanceof Group) {
            rhs = rhs.alts[0].items[0].item.rhs;
        }
        return rhs;
    }
    collectTodo(gen) {
        const rhs = this.flatten();
        rhs.collectTodo(gen);
    }
}

class Leaf {
    constructor(value) {
        this.value = value;
    }
    *[Symbol.iterator]() {
        if (false) yield;
    }
    nullableVisit(rules) {
        throw new NotImplementedError();
    }
    initialNames() {
        throw new NotImplementedError();
    }
}

class NameLeaf extends Leaf {
    nullableVisit(rules) {
        if (this.value in rules) {
            return rules[this.value].nullableVisit(rules);
        }
        // Token or unknown; never empty.
        return false;
    }
    initialNames() {
        return new Set(this.value);
    }
}

class StringLeaf extends Leaf {
    nullableVisit(rules) {
        // # The string token '' is considered empty.
        return !this.value;
    }
    initialNames() {
        return new Set();
    }
}

class Rhs {
    constructor(alts) {
        this.alts = alts;
        this.memo = null;
    }
    *[Symbol.iterator]() {
        yield this.alts;
    }
    nullableVisit(rules) {
        return this.alts.some((alt) => alt.nullableVisit(rules));
    }
    initialNames() {
        const names = new Set();
        this.alts.forEach((alt) => {
            for (let elem of alt.initialNames()) {
                names.add(elem);
            }
        });
        return names;
    }
    collectTodo(gen) {
        this.alts.forEach((alt) => {
            alt.collectTodo(gen);
        });
    }
}

class Alt {
    constructor(item, icut = -1, action = null) {
        this.items = items;
        this.icut = icut;
        this.action = action;
    }
    *[Symbol.iterator]() {
        yield this.items;
    }
    nullableVisit(rules) {
        return !this.items.some((item) => !item.nullableVisit(rules));
    }
    initialNames() {
        const names = new Set();
        for (let item of this.items) {
            for (let elem of item.initialNames()) {
                names.add(elem);
            }
            if (!item.nullable) {
                break;
            }
        }
        return names;
    }
    collectTodo(gen) {
        this.items.forEach((item) => item.collectTodo());
    }
}

class NamedItem {
    constructor(name, item, type = null) {
        this.name = name;
        this.item = item;
        this.type = type;
        this.nullable = false;
    }
    *[Symbol.iterator]() {
        yield this.item;
    }
    nullableVisit(rules) {
        return (this.nullable = this.item.nullableVisit(rules));
    }
    initialNames() {
        return this.item.initialNames();
    }
    collectTodo(gen) {
        gen.callmakervisitor.visit(this.item);
    }
}

class Lookahead {
    constructor(node, sign) {
        this.node = node;
        this.sign = sign;
    }
    *[Symbol.iterator]() {
        yield this.node;
    }
    nullableVisit() {
        return true;
    }
    initialNames() {
        return new Set();
    }
}

class PositiveLookahead extends Lookahead {
    constructor(node) {
        super(node, "&");
    }
}

class NegativeLookahead extends Lookahead {
    constructor(node) {
        super(node, "!");
    }
}

class Opt {
    constructor(node) {
        this.node = node;
    }
    nullableVisit(rules) {
        return true;
    }
    initialNames() {
        return this.node.initialNames();
    }
}

class Repeat {
    constructor(node) {
        this.node = node;
        this.memo = null;
    }
    nullableVisit(rules) {
        throw new NotImplementedError();
    }
    *[Symbol.iterator]() {
        yield this.node;
    }
    initialNames() {
        return this.node.initialNames();
    }
}

class Repeat0 extends Repeat {
    nullableVisit(rules) {
        return true;
    }
}

class Repeat1 extends Repeat {
    nullableVisit(rules) {
        return false;
    }
}

class Gather extends Repeat {
    constructor(separator, node) {
        this.separator = separator;
        this.node = node;
    }
    nullableVisit(rules) {
        return false;
    }
}

class Group {
    constructor(rhs) {
        this.rhs = rhs;
    }
    *[Symbol.iterator]() {
        yield this.rhs;
    }
    nullableVisit(rules) {
        return this.rhs.nullableVisit(rules);
    }
    initialNames() {
        return this.rhs.initialNames();
    }
}

class Cut {
    *[Symbol.iterator]() {
        if (false) yield;
    }
    nullableVisit(rules) {
        return true;
    }
    initialNames() {
        return new Set();
    }
}
