(function (j) {
    'use strict';

    function not(a) {
        return !a;
    }

    function invert(pred) {
        return function (value) {
            return !pred(value);
        };
    }

    function compare (operator){
        return function (a) {
            return function (b) {
                switch(operator) {
                    case '===':
                        return a === b;
                    case '&&':
                        return Boolean(a && b);
                    case '||':
                        return Boolean(a || b);
                    case 'xor':
                        return Boolean(a ? !b : b);
                }
            };
        };
    }

    var currySignature = 'comparable => comparable => boolean';

    j.invert = j.enforce('function => function', invert);
    j.not = j.enforce('comparable => boolean', not);

    j.equal = j.enforce(currySignature, compare('==='));
    j.and = j.enforce(currySignature, compare('&&'));
    j.or = j.enforce(currySignature, compare('||'));
    j.xor = j.enforce(currySignature, compare('xor'));

    // Type functions (for speed and reuse)

    j.isArray = j.isTypeOf('array');
    j.isBoolean = j.isTypeOf('boolean');
    j.isFunction = j.isTypeOf('function');
    j.isNull = j.isTypeOf('null');
    j.isNumber = j.isTypeOf('number');
    j.isObject = j.isTypeOf('object');
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