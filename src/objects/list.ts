import { checkIterable } from "../util/checks";
import { pyObject } from "./object";

export class pyList<T extends pyObject[] | IterableIterator<pyObject> = pyObject[]> extends pyObject {
    #_: pyObject[];
    constructor(arr?: T | undefined) {
        super();
        if (arr === undefined) {
            this.#_ = [];
        } else if (Array.isArray(arr)) {      
            this.#_ = arr;
        } else if (checkIterable(arr)) {
            this.#_ = [...arr];
        } else {
            throw TypeError("bad internal call to tuple constructor");
        }
        Object.freeze(this.#_);
    }
}