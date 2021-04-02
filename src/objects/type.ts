import { Args, Kwargs } from "../util/kwargs";
import { chainOrSuspend, handleSuspensionOrReject, Suspension } from "../util/suspensions";
import { tp$call, tp$init, tp$new, tp$getattr, tp$setattr, tp$repr, tp$flags, tp$mro, ob$type, tp$base, tp$bases, tp$lookup, tp$dict, tp$unhashable, nb$add } from "../util/symbols";
import { pyDict } from "./dict";
import { pyTypeError } from "./error";
import { pyNotImplementedType } from "./nonetype";
import { pyObject, pyObjectConstructor } from "./object";
import { pyInterface } from "./pyinterface";
import { pyStr } from "./str";

export interface pyType extends pyObject {
    [tp$call](args: Args, kws?: Kwargs): pyObject | pyType;
    [Symbol.hasInstance](obj: unknown): obj is pyType;
    isSubType(type: pyType): boolean;
}

export interface pyTypeConstructor {
    (obj: pyObject): pyType;
    readonly prototype: pyType;
}

export const pyType: pyTypeConstructor = function (obj: pyObject): pyType {
    if (new.target) {
        throw new TypeError("fail")
        // fail
    }
    return obj[ob$type];
};


pyType.prototype[tp$call] = function type_call(args: Args, kwargs?:Kwargs): pyObject | pyType {
    if (this === pyType) {
        // check the args are 1 - only interested in the 1 argument form if
        // if the nargs and nkeywords != 1 or 3 and zero raise an error
        if (args.length === 1 && (kwargs === undefined || !kwargs.length)) {
            return args[0][ob$type];
        } else if (args.length !== 3) {
            throw new pyTypeError("type() takes 1 or 3 arguments");
        }
    }
    let obj: pyObject;
    let newSuspended = true;
    const _init = (o: pyObject): void => {
        newSuspended = false;
        obj = o;
        if (!o[ob$type].isSubType(this)) {
            return;
        }
        return o[tp$init](args, kwargs);
    };

    try {
        const obj: pyObject = this.prototype[tp$new](args, kwargs);
        _init(obj);
        return obj;
    } catch (err) {
        return handleSuspensionOrReject(err, (child: Suspension) => {
            if (newSuspended) {
                throw new Suspension(() => chainOrSuspend(() => child.resume(), _init, () => obj), child);
            } else {
                throw new Suspension(() => chainOrSuspend(()=> child.resume, () => obj), child);
            }
        });
    }
}


pyType.prototype[tp$new] = (args: Args, kwargs?: pyObject[]): pyObjectConstructor => {
    interface klass extends pyObject {}
    interface klassConstructor extends pyObjectConstructor<klass> {}

    const klass: klassConstructor = function klass () {
        this.$d = new pyDict();
        return this as klass;
    } as unknown as klassConstructor;

    Object.setPrototypeOf(klass.prototype, pyObject.prototype);
    Object.setPrototypeOf(klass, pyType.prototype);

    return klass;

}

function foo() {
    interface klass extends pyObject {}
    interface klassConstructor extends pyObjectConstructor<klass> {}

    const klass: klassConstructor = function klass () {
        this.$d = new pyDict();
        return this as klass;
    } as unknown as klassConstructor;

    Object.setPrototypeOf(klass.prototype, pyObject.prototype);
    Object.setPrototypeOf(klass, pyType.prototype);

    return klass;
    
}

Object.assign(pyType.prototype, {
    [Symbol.hasInstance]: {
        value: type_instance_check,
        writable: true,
    },
    foo: {
        value: "bar",
    },
    [tp$call]: {
        value: type_call,
        writable: true,
    },
    [tp$init]: {
        value: type_init,
        writable: true,
    },
    [tp$new]: {
        value: type_new,
        writable: true,
    },
    [tp$getattr]: {
        value: type_getattr,
        writable: true,
    },
    [tp$setattr]: {
        value: type_setattr,
        writable: true,
    },
    [tp$repr]: {
        value: type_repr,
        writable: true,
    },
    [tp$flags]: {
        value: {},
        writable: true,
    },
});

function type_call(args, kws) {
    return "foo";
}

function type_init(args, kws) {
    return "bar";
}

function type_new(args, kws) {}

function type_instance_check(instance: any) {
    return instance ?? (instance.constructor === this || instance[tp$mro].includes(this));
}

function type_getattr() {}

function type_setattr() {}

function type_repr() {}
