(function (j) {
    'use strict';


    function invert(pred) {
        return function (value) {
            return not(pred(value));
        };
    }

    function curryCompare(comparator) {
        return function (a) {
            return function (b) {
                return Boolean(comparator(a, b));
            };
        };
    }

    function not(a) { return !a; }
    function and (a, b) { return a && b; }
    function or (a, b) { return a || b; }
    function xor (a, b) { return a ? !b : b; }
    function equal (a, b){ return a === b; }

    var currySignature = 'comparable => comparable => boolean';

    j.invert = j.enforce('function => function', invert);
    j.not = j.enforce('comparable => boolean', not);

    j.equal = j.enforce(currySignature, curryCompare(equal));
    j.and = j.enforce(currySignature, curryCompare(and));
    j.or = j.enforce(currySignature, curryCompare(or));
    j.xor = j.enforce(currySignature, curryCompare(xor));

    // Type functions (for speed and reuse)

    j.isArray = j.isTypeOf('array');
    j.isBoolean = j.isTypeOf('boolean');
    j.isFunction = j.isTypeOf('function');
    j.isNull = j.isTypeOf('null');
    j.isNumber = j.isTypeOf('number');
    j.isObject = j.isTypeOf('object');
    j.isObjectInstance = j.isTypeOf('objectInstance');
    j.isString = j.isTypeOf('string');
    j.isUndefined = j.isTypeOf('undefined');

    j.isNil = j.isTypeOf('nil');
    j.isPair = j.isTypeOf('pair');
    j.isPredicate = j.isTypeOf('predicate');
    j.isInt = j.isTypeOf('int');
    j.isNatural = j.isTypeOf('natural');
    j.isObjectInstance = j.isTypeOf('objectInstance');
    j.isNotNull = j.isTypeOf('notNull');
    j.isNotNil = j.isTypeOf('notNil');
    j.exists = j.isTypeOf('exists');
    j.isConcatable = j.isTypeOf('concatable');
    j.isDefined = j.isTypeOf('defined');
    j.isComparable = j.isTypeOf('comparable');
    j.isNumeric = j.isTypeOf('numeric');
    j.isReferencible = j.isTypeOf('referencible');

})(jfp);