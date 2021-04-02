$jscomp.initSymbolIterator = function () {
    $jscomp.initSymbol();
    var g = $jscomp.global.Symbol.iterator;
    g || (g = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("Symbol.iterator"));
    "function" != typeof Array.prototype[g] &&
        $jscomp.defineProperty(Array.prototype, g, {
            configurable: !0,
            writable: !0,
            value: function () {
                return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
            },
        });
    $jscomp.initSymbolIterator = function () {};
};
$jscomp.initSymbolAsyncIterator = function () {
    $jscomp.initSymbol();
    var g = $jscomp.global.Symbol.asyncIterator;
    g || (g = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("Symbol.asyncIterator"));
    $jscomp.initSymbolAsyncIterator = function () {};
};
$jscomp.iteratorPrototype = function (g) {
    $jscomp.initSymbolIterator();
    g = { next: g };
    g[$jscomp.global.Symbol.iterator] = function () {
        return this;
    };
    return g;
};
$jscomp.makeIterator = function (g) {
    var r = "undefined" != typeof Symbol && Symbol.iterator && g[Symbol.iterator];
    return r ? r.call(g) : $jscomp.arrayIterator(g);
};
$jscomp.arrayFromIterator = function (g) {
    for (var r, a = []; !(r = g.next()).done; ) a.push(r.value);
    return a;
};
$jscomp.arrayFromIterable = function (g) {
    return g instanceof Array ? g : $jscomp.arrayFromIterator($jscomp.makeIterator(g));
};
$jscomp.owns = function (g, r) {
    return Object.prototype.hasOwnProperty.call(g, r);
};

$jscomp.initSymbolIterator = function () {
    $jscomp.initSymbol();
    var g = $jscomp.global.Symbol.iterator;
    g || (g = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("Symbol.iterator"));
    "function" != typeof Array.prototype[g] &&
        $jscomp.defineProperty(Array.prototype, g, {
            configurable: !0,
            writable: !0,
            value: function () {
                return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
            },
        });
    $jscomp.initSymbolIterator = function () {};
};
$jscomp.initSymbolAsyncIterator = function () {
    $jscomp.initSymbol();
    var g = $jscomp.global.Symbol.asyncIterator;
    g || (g = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("Symbol.asyncIterator"));
    $jscomp.initSymbolAsyncIterator = function () {};
};
$jscomp.iteratorPrototype = function (g) {
    $jscomp.initSymbolIterator();
    g = { next: g };
    g[$jscomp.global.Symbol.iterator] = function () {
        return this;
    };
    return g;
};
$jscomp.makeIterator = function (g) {
    var r = "undefined" != typeof Symbol && Symbol.iterator && g[Symbol.iterator];
    return r ? r.call(g) : $jscomp.arrayIterator(g);
};
$jscomp.arrayFromIterator = function (g) {
    for (var r, a = []; !(r = g.next()).done; ) a.push(r.value);
    return a;
};
$jscomp.arrayFromIterable = function (g) {
    return g instanceof Array ? g : $jscomp.arrayFromIterator($jscomp.makeIterator(g));
};
$jscomp.owns = function (g, r) {
    return Object.prototype.hasOwnProperty.call(g, r);
};
$jscomp.arrayIterator = function (g) {
    return { next: $jscomp.arrayIteratorImpl(g) };
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty =
    $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (g, r, a) {
              g != Array.prototype && g != Object.prototype && (g[r] = a.value);
          };
$jscomp.getGlobal = function (g) {
    return "undefined" != typeof window && window === g ? g : "undefined" != typeof global && null != global ? global : g;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function () {
    $jscomp.initSymbol = function () {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};

$jscomp.arrayIteratorImpl = function (g) {
    var r = 0;
    return function () {
        return r < g.length ? { done: !1, value: g[r++] } : { done: !0 };
    };
};