export { GeneratedParser } from "./src/parser/generated_parser";
export { tokenize } from "./src/parser/tokenize";
export { readline, Tokenizer } from "./src/parser/Tokenizer";

export * as foo from "./src/util/String";

import { __exportStar } from "./.yarn/cache/tslib-npm-2.1.0-81c9ac9b82-d8f5bdd067.zip/node_modules/tslib/tslib";
// export {bar} from "./internal"

import {tp$repr, tp$new, tp$methods, nb$bool} from "./src/util/symbols";

function ___buildNativeClass(name: string): Function {
    console.log('native class called')
    return function(constructor: Function) {
        debugger;
        console.log('native class done');
        return constructor
    }
}


function method(flags, docstring, textsignature) {
    console.log('method called')
    return function (
        target,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        debugger;
        const meth = descriptor.value;
        meth.flags = flags;
        meth.docstring = docstring;
        meth.textsignature = textsignature;
        console.log('method done')
    }
}

function classmethod(flags, docstring, textsignature) {
    console.log('method called')
    return function (
        target,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        debugger;
        const meth = descriptor.value;
        meth.flags = flags;
        meth.docstring = docstring;
        meth.textsignature = textsignature;
        console.log('method done')
    }
}

function prop(target, key) {
    target[key] = 1;
}

function getset(...decargs) {
    debugger;
    return function (...args) {
        debugger;
    }
}

function _getset(...args) {
    debugger;
}

function test(...args) {
    return args;
}

@___buildNativeClass("NoneType")
class ___pyNoneType {
    constructor() {
        // return pyNone;
    }
    valueOf(): null {
        return null;
    }

    @method({NoArgs: true}, 'this is a docstring foo', 'bar')
    foo() {
        return 'bar'
    }

    @classmethod({NoArgs: true}, 'this is a docstring foo', 'bar')
    bar() {

    }

    @getset("some doc string")
    get __class__() {
        this.name();
        return 'foo'
    }
    set __class__(v) {
    }

    @prop
    eggs;

    public name() {
        console.log('foo')
    }

}

export const ___pyNone: ___pyNoneType = Object.create(___pyNoneType.prototype);
