var jfp = (function(){
    'use strict';
    
    return function () {};
    
})();

(function (j) {
    'use strict';

    var _signet = typeof signet !== 'undefined' ? signet : null;

    if (typeof require === 'function') {
        _signet = require('signet')();
    }

    var isFunction = _signet.isTypeOf('function');
    var isNull = _signet.isTypeOf('null');
    var isUndefined = _signet.isTypeOf('undefined');

    function checkNil(value) {
        return value.length === 0;
    }

    function checkMaybe(value, typeObj) {
        return _signet.isTypeOf(typeObj[0])(value) || isNull(value);
    }

    function checkSignet(value) {
        return isFunction(value.subtype) &&
            isFunction(value.extend) &&
            isFunction(_signet.isTypeOf);
    }

    function checkNull(value) {
        return value === null;
    }

    function checkNotNull(value) {
        return !checkNull(value);
    }

    function checkNotNil(value) {
        return !checkNil(value);
    }

    function checkDefined(value) {
        return !isUndefined(value) && checkNotNull(value);
    }

    function checkExists(value) {
        return checkNotNull(value) &&
            checkNotNil(value) &&
            checkDefined(value);
    }

    function checkNatural(value) {
        return value >= 0;
    }

    function checkPair(value) {
        return value.length > 0;
    }

    function checkConcatable(value) {
        return checkDefined(value) && checkNotNull(value) && isFunction(value.concat);
    }

    function checkObjectInstance(value) {
        return value !== null;
    }

    function setJfpTypes(__signet) {
        var numberPattern = '^[0-9]+((\\.[0-9]+)|(e\\-?[0-9]+))?$';

        __signet.subtype('array')('nil', checkNil);
        __signet.subtype('array')('pair', checkPair);
        __signet.subtype('int')('natural', checkNatural);
        __signet.subtype('object')('signet', checkSignet);
        __signet.subtype('object')('objectInstance', checkObjectInstance);

        __signet.extend('maybe', checkMaybe);
        __signet.extend('notNull', checkNotNull);
        __signet.extend('notNil', checkNotNil);
        __signet.extend('exists', checkExists);
        __signet.extend('concatable', checkConcatable);

        __signet.extend('defined', checkDefined);

        __signet.alias('index', 'natural');
        __signet.alias('typeString', 'string');
        __signet.alias('predicate', 'function');
        __signet.alias('comparable', 'variant<boolean;number;string>');
        __signet.alias('numeric', 'variant<number;formattedString<' + numberPattern + '>>');
        __signet.alias('objectKey', 'variant<string;symbol>');
        __signet.alias('referencible', 'variant<objectInstance;string;function>');

        return __signet;
    }

    setJfpTypes(_signet);

    Object.defineProperty(j, 'nil', {
        get: function () {
            return [];
        }
    });

    function either(typeDef) {
        var checkType = _signet.isTypeOf(typeDef);

        return function (defaultValue) {
            return function (value) {
                return checkType(value) ? value : defaultValue;
            };
        };
    }

    function maybe(typeDef) {
        return either(typeDef)(null);
    }

    // Type system behaviors
    j.either = _signet.enforce('type => * => *', either);
    j.enforce = _signet.enforce;
    j.isTypeOf = _signet.isTypeOf;
    j.maybe = _signet.enforce('* => maybe<defined>', maybe);
    j.setJfpTypes = _signet.enforce('signet => signet', setJfpTypes);
    j.typeChain = _signet.typeChain;

    // Prefab either checks

    j.eitherArray = either('array');
    j.eitherBoolean = either('boolean');
    j.eitherFunction = either('function');
    j.eitherInt = either('int');
    j.eitherNatural = either('natural');
    j.eitherNumber = either('number');
    j.eitherObject = either('object');
    j.eitherString = either('string');

    j.eitherConcatable = either('concatable');
    j.eitherObjectInstance = either('objectInstance');
    j.eitherReferencible = either('referencible');

    j.eitherDefined = either('defined');
    j.eitherNotNull = either('notNull');

    j.maybeDefined = maybe('defined');


})(jfp);

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

(function (j) {
    'use strict';

    function identity(value) {
        return value;
    }

    function always(value) {
        return function () {
            return value;
        };
    }

    function concat(valuesA, valuesB) {
        return valuesA.concat(valuesB);
    }

    function rconcat(valuesA, valuesB) {
        return valuesB.concat(valuesA);
    }

    function cons(value, values) {
        return typeof value === 'undefined' ? values : [value].concat(values);
    }

    function conj(value, values) {
        return typeof value === 'undefined' ? values : values.concat([value]);
    }

    function slice(start, end) {
        var bounds = typeof end === 'undefined' ? [start] : [start, end];

        return function (valueSet) {
            return Array.prototype.slice.apply(valueSet, bounds);
        };
    }

    var argumentsToArray = slice(0);

    function splice(index, length) {
        return function (values) {
            var result = argumentsToArray(values);
            var count = j.eitherNatural(values.length - index)(length);

            result.splice(index, count);

            return result;
        }
    }

    function apply(fn, args) {
        return fn.apply(null, args);
    }

    function buildRecursor(result) {
        return function () {
            result.args = argumentsToArray(arguments);
            return result;
        };
    }

    function pick(key) {
        return function (obj) {
            try {
                return j.maybeDefined(obj[key]);
            } catch (e) {
                return null;
            }
        };
    }

    var pickId = pick('id');

    function recur(fn) {
        // Each recursion needs to be signed to avoid collisions
        var id = Math.floor(Math.random() * 1000000);

        return function () {
            var result = {
                id: id,
                args: argumentsToArray(arguments)
            };
            var recursor = buildRecursor(result);

            while (pickId(result) === id) {
                result = apply(fn, cons(recursor, result.args));
            }

            return result;
        };
    }

    function lastIndexOf(values) {
        return values.length - 1;
    }

    function compose(f, g) {
        return function () {
            var args = argumentsToArray(arguments);
            return f(g.apply(null, args));
        };
    }

    function reverseArgs(fn) {
        return function () {
            return apply(fn, argumentsToArray(arguments).reverse());
        };
    }

    function buildCurriable(fn, count, initialArgs) {
        return function curriable() {
            var args = concat(initialArgs, argumentsToArray(arguments));
            return !(args.length < count) ? apply(fn, args) : buildCurriable(fn, count, args);
        }
    }

    function curry(fn, count, args) {
        return buildCurriable(fn, j.eitherNatural(fn.length)(count), j.eitherArray([])(args));
    };

    var sliceRest = slice(1);
    
    function directionalPartial(concat) {
        return function (fn) {
            var args = sliceRest(arguments);

            return function () {
                return apply(fn, concat(args, argumentsToArray(arguments)));
            };
        };
    }

    var partial = directionalPartial(concat);
    var rpartial = directionalPartial(rconcat);

    function repeat(fn, optionalPred) {
        var pred = j.eitherFunction(always(true))(optionalPred);

        return function (count) {
            return function (value) {
                var result = value;
                for (var i = 0; i < count; i++) {
                    result = fn(result);
                }
                return result;
            }
        }
    }

    // JFP core functions
    j.always = j.enforce('* => * => *', always);
    j.apply = j.enforce('function, array<*> => *', apply);
    j.argumentsToArray = j.enforce('arguments => array', argumentsToArray);
    j.compose = j.enforce('function, function => function', compose);
    j.concat = curry(j.enforce('concatable, concatable => concatable', concat), 2);
    j.conj = j.enforce('*, array<*> => array<*>', conj);
    j.cons = j.enforce('*, array<*> => array<*>', cons);
    j.curry = j.enforce('function, [int], [array<*>] => [*] => *', curry);
    j.identity = j.enforce('* => *', identity);
    j.partial = j.enforce('function, [*] => [*] => *', partial);
    j.pick = j.enforce('string => * => maybe<defined>', pick);
    j.recur = j.enforce('function => function', recur);
    j.repeat = j.enforce('function => int => * => *', repeat);
    j.rpartial = j.enforce('function, [*] => [*] => *', rpartial);
    j.reverseArgs = j.enforce('function => [*] => *', reverseArgs);
    j.slice = j.enforce('int, [int] => variant<array;arguments> => array', slice);
    j.splice = j.enforce('int, [int] => array<*> => array<*>', splice);

})(jfp);

(function (j) {
    'use strict';

    function operation(operator) {
        return function (a, b) {
            switch (operator) {
                case '+':
                    return a + b;
                case '-':
                    return a - b;
                case '*':
                    return a * b;
                case '/':
                    return a / b;
                case '%':
                    return a % b;
            }
        };
    }

    function greater(a, b) { return a > b; }
    function less(a, b) { return a < b; }

    function greaterOrEqual(a, b) { return !(a < b); }
    function lessOrEqual(a, b) { return !(a > b); }

    function curryOperation(operation) {
        return function (a) {
            return function (b) {
                return operation(a, b);
            };
        };
    }

    function operateBy(operator) {
        return function (a) {
            return function (b) {
                return operation(operator)(b, a);
            };
        };
    }

    function range(min, increment) {
        var offset = j.eitherNumber(1)(increment);

        return function (max) {
            var result = [];

            for (var i = min; i <= max; i += offset) {
                result.push(i)
            }

            return result;
        };
    }

    function min (a, b) { return less(a, b) ? a : b; }
    function max (a, b) { return greater(a, b) ? a : b; }

    function between(min, max) {
        if (min >= max) {
            throw new Error('Invalid range, ' + min + ' is not less than ' + max);
        }

        return function (value) {
            return !(value < min) && !(value > max);
        };
    }

    // Arithmetic
    j.add = j.enforce('number, number => number', operation('+'));
    j.divide = j.enforce('number, number => number', operation('/'));
    j.mod = j.enforce('number, number => number', operation('%'));
    j.multiply = j.enforce('number, number => number', operation('*'));
    j.subtract = j.enforce('number, number => number', operation('-'));

    j.addBy = j.enforce('number => number => number', operateBy('+'));
    j.divideBy = j.enforce('number => number => number', operateBy('/'));
    j.modBy = j.enforce('number => number => number', operateBy('%'));
    j.multiplyBy = j.enforce('number => number => number', operateBy('*'));
    j.subtractBy = j.enforce('number => number => number', operateBy('-'));

    j.min = j.enforce('number, number => number', min);
    j.max = j.enforce('number, number => number', max);

    j.inc = j.enforce('int => int', function (a) { return a + 1; });
    j.dec = j.enforce('int => int', function (a) { return a - 1; });

    j.range = j.enforce('int, [int] => int => array<int>', range);

    j.gt = j.enforce('number => number => boolean', curryOperation(greater));
    j.geq = j.enforce('number => number => boolean', curryOperation(greaterOrEqual));
    j.lt = j.enforce('number => number => boolean', curryOperation(less));
    j.leq = j.enforce('number => number => boolean', curryOperation(lessOrEqual));
    j.between = j.enforce('number, number => number => boolean', between);

})(jfp);

(function (j) {
    'use strict';

    function isUndefined(value) {
        return typeof value === 'undefined';
    }


    function nth(index) {
        return function (values) {
            return j.maybeDefined(values[index]);
        };
    }

    function lastIndexOf(values) {
        return j.eitherNatural(0)(values.length - 1);
    }

    function dropNth(index) {
        return j.splice(index, 1);
    }

    var first = nth(0);
    var rest = j.slice(1);

    function last(values) {
        return j.nth(lastIndexOf(values))(values);
    }

    function dropLast(values) {
        return j.slice(0, lastIndexOf(values))(values);
    }

    function isFoldBreak(value) {
        return typeof value === 'undefined' ||
            value === null ||
            value === false;
    }

    function reverse(values) {
        return j.slice(0)(values).reverse();
    }

    function foldl(fn, initial) {
        return function (values) {
            var initialIsDefined = !j.isUndefined(initial);
            var result = initialIsDefined ? initial : first(values);
            var listLen = values.length;
            var i = initialIsDefined ? 0 : 1;

            for (i; i < listLen; i++) {
                result = fn(result, values[i]);
            }

            return result;
        };
    }

    function foldr(fn, initial) {
        var foldPredef = foldl(fn, initial);
        return function (values) {
            return foldPredef(reverse(values));
        }
    }

    function operationApplicator(operation) {
        return function (behavior, initial) {
            return function (fn) {
                var appliedOperation = operation(behavior(fn), initial);

                return function (values) {
                    return appliedOperation(values);
                };
            };
        };
    }

    function filterer(pred) {
        return function (result, value) {
            return pred(value) ? pushUnsafe(result)(value) : result; //j.conj(value, result) : result;
        };
    }

    function mapper(fn) {
        return function (result, value) {
            return pushUnsafe(result)(fn(value));
        };
    }

    function buildGetPartitionIndex (pred) {
        return function (value) {
            return pred(value) ? 0 : 1;
        };
    }

    function partitioner(pred) {
        var getIndex = buildGetPartitionIndex(pred);
        return function (result, value) {
            pushUnsafe(result[getIndex(value)])(value);
            return result;
        };
    }

    function find(pred) {
        return function (values) {
            var result = values[0];
            var listLen = values.length;

            for (var i = 1; !(i > listLen); i++) {
                if(pred(result)){ return result; }
                result = values[i];
            }

            return j.maybeDefined(result);
        };
    }

    var foldlApplicator = operationApplicator(foldl);

    function filter (pred) {
        return foldlApplicator(filterer, [])(pred);
    }

    function map (fn) {
        return foldlApplicator(mapper, [])(fn);
    }

    function partition (pred) {
        return foldlApplicator(partitioner, [[], []])(pred);
    }

    function rreduceRecur(recur, fn, lastResult, values) {
        var firstValue = first(values);
        var restValues = rest(values);
        var firstIsArray = j.isArray(firstValue);

        var nextResult = firstIsArray ? lastResult : fn(lastResult, firstValue);
        var nextRemaining = firstIsArray ? j.concat(restValues, firstValue) : restValues;

        return recur(nextResult, nextRemaining);
    }

    function rreduce(fn, initialValue) {
        return function (values) {
            var initValue = j.eitherDefined(first(values))(initialValue);
            var remaining = j.isUndefined(initialValue) ? rest(values) : values;

            return j.recur(function (recur, lastResult, values) {
                return j.isNil(values) ? lastResult : rreduceRecur(recur, fn, lastResult, values);
            })(initValue, remaining);
        };
    }

    var rreduceApplicator = operationApplicator(rreduce);
    var rfilter = rreduceApplicator(filterer, []);
    var rmap = rreduceApplicator(mapper, []);
    var rpartition = rreduceApplicator(partitioner, [[], []]);

    function sort(comparator) {
        return function (values) {
            return j.slice(0)(values).sort(j.eitherFunction(j.subtract)(comparator));
        };
    }

    function existence(methodBuilder) {
        return function (pred) {
            var method = methodBuilder(pred);

            return function (values) {
                return j.recur(method)(values);
            }
        };
    }

    function buildEvery(pred) {
        return function every(recur, values) {
            return !pred(first(values)) ? j.isNil(values) : recur(rest(values));
        }
    }

    function buildNever(pred) {
        return function never(recur, values) {
            var result = pred(first(values))
            return j.isNil(values) || result ? !result : recur(rest(values));
        }
    }

    function buildAtLeastOne(pred) {
        return function atLeastOne(recur, values) {
            var result = pred(first(values))
            return j.isNil(values) || result ? result : recur(rest(values));
        }
    }

    function take(count) {
        return j.slice(0, count);
    }

    function pushUnsafe(values) {
        return function (value) {
            values.push(value);
            return values;
        }
    }

    function until(pred) {
        return function (action, initial) {
            return function (values) {
                var result = initial;
                var value;

                for (var i = 0; i < values.length; i++) {
                    value = values[i];

                    if(pred(value)) { return result; }
                    result = action(result, value);
                }

                return result;
            };
        };
    }

    function takeUntil(pred) {
        var untilPred = until(pred)

        return function (values) {
            return untilPred(takeValue, [])(values);
        };

        function takeValue(result, value) {
            return pushUnsafe(result)(value);
        }
    }

    function some(pred) {
        return function (values) {
            var exists = false;
            var listLen = values.length;

            for (var i = 0; i < listLen && !exists; i++) {
                exists = pred(values[i]);
            }

            return exists;
        };
    }

    function none(pred) {
        return some(j.invert(pred));
    }

    function all(pred) {
        return j.invert(some(j.invert(pred)));
    }


    j.all = j.enforce('function => array => boolean', all);
    j.compact = j.enforce('[array] => array', filter(Boolean));
    j.dropLast = j.enforce('array => array', dropLast);
    j.dropNth = j.enforce('index => array => array', dropNth);
    j.filter = j.enforce('function => array => array', filter);
    j.first = j.enforce('array => maybe<defined>', first);
    j.find = j.enforce('function<*> => array => maybe<defined>', find);
    j.foldl = j.enforce('function, [*] => array => *', foldl);
    j.foldr = j.enforce('function, [*] => array => *', foldr);
    j.lastIndexOf = j.enforce('array => index', lastIndexOf);
    j.map = j.enforce('function => array => array', map);
    j.none = j.enforce('function => array => boolean', none);
    j.nth = j.enforce('index => array => maybe<defined>', nth);
    j.partition = j.enforce('function => array => tuple<array;array>', partition);
    j.pushUnsafe = j.enforce('array => * => array', pushUnsafe);
    j.rest = rest;
    j.reverse = j.enforce('array => array', reverse);
    j.rfilter = j.enforce('function => array => array', rfilter);
    j.rmap = j.enforce('function => array => array', rmap);
    j.rpartition = j.enforce('function => array => array<array;array>', rpartition);
    j.rreduce = j.enforce('function, [*] => array => *', rreduce);
    j.some = j.enforce('function => array => boolean', some);
    j.sort = j.enforce('[*] => array => array', sort);
    j.take = j.enforce('[index] => function<array>', take);
    j.takeUntil = j.enforce('predicate => array => array', takeUntil);
    j.until = j.enforce('predicate => function, * => *', until);

})(jfp);

(function (j) {
    'use strict';

    function pickByObj(obj) {
        return function (key) {
            return pick(key)(obj);
        };
    }

    function deref(key) {
        var tokens = key.split('.');

        return function (obj) {
            var result = obj;
            var tokenLen = tokens.length;

            for (var i = 0; i < tokenLen && result !== null; i++) {
                try {
                    result = result[tokens[i]];
                } catch (e) {
                    return null;
                }
            }

            return j.maybeDefined(result);
        };
    }

    function setValue(obj) {
        return function (result, key) {
            result[key] = obj[key];
            return result;
        };
    }

    function mergeToUnsafe(objA) {
        return function (objB) {
            return j.foldl(setValue(objB), objA)(Object.keys(objB));
        };
    }

    function shallowClone(obj) {
        var cloneTo = j.isArray(obj) ? [] : {};
        return mergeToUnsafe(cloneTo)(obj);
    }

    function merge(objA, objB) {
        return mergeToUnsafe(shallowClone(objA))(objB);
    }

    function getKeys(obj) {
        return Object.keys(obj);
    }

    function toArray(obj) {
        return j.map(function (key) {
            return [key, obj[key]];
        })(getKeys(obj));
    }

    function toValues(obj) {
        var keys = getKeys(obj);
        var result = [];

        for (var i = 0; i < keys.length; i++) {
            result.push(obj[keys[i]]);
        }

        return result;
    }

    function addProperty(obj, propertyPair) {
        obj[propertyPair[0]] = propertyPair[1];
        return obj;
    }

    function toObject(tupleArray) {
        var result = {};

        for (var i = 0; i < tupleArray.length; i++) {
            var tuple = tupleArray[i];
            result[tuple[0]] = tuple[1];
        }

        return result;
    }

    function clone(obj) {
        var result = j.isArray(obj) ? [] : {};
        var keys = Object.keys(obj);

        try {
            return j.foldl(copyKeys, result)(keys);
        } catch (e) {
            throw new Error('Object is circular or too deep to clone.');
        }

        function copyKeys(result, key) {
            var value = obj[key];
            result[key] = j.isObject(value) ? clone(value) : value;
            return result;
        }
    }

    j.clone = j.enforce('object => object', clone);
    j.deref = j.enforce('string => * => maybe<defined>', deref);
    j.merge = j.enforce('object, object => object', merge);
    j.mergeToUnsafe = j.enforce('object => object => object', mergeToUnsafe);
    j.shallowClone = j.enforce('object => object => object', shallowClone);
    j.toArray = j.enforce('object => array<tuple<objectKey;*>>', toArray);
    j.toObject = j.enforce('array<tuple<objectKey;*>> => object', toObject);
    j.toValues = j.enforce('object => array<*>', toValues);

})(jfp);


(function (j) {
    'use strict';

    function then(fn) {
        var isFunction = j.isFunction(fn);
        var action = isFunction ? fn : j.identity;
        var index = isFunction ? 1 : 0;

        return [action, j.slice(index)(arguments)];
    }

    function when(condArray) {
        var pushToCondArray = j.pushUnsafe(condArray);
        return function (prop, behavior) {
            if (prop) {
                pushToCondArray(behavior);
            }
        };
    }

    function throwOnNil(condFn) {
        var condSource = condFn.toString();

        return function (result) {
            if (j.isNil(result)) {
                throw new Error('All possible conditions were not represented in ' + condSource);
            }
        };
    }

    function handleResult(resultSet, throwOnNil) {
        var result = j.first(resultSet);

        throwOnNil(result);

        var action = result[0];
        var args = result[1];

        return j.apply(action, args);
    }

    function cond(condFn) {
        var condArray = [];
        var _default = true;

        condFn(when(condArray), then, _default);

        return handleResult(condArray, throwOnNil(condFn));
    }

    j.cond = j.enforce('function<function;function;boolean> => *', cond);

})(jfp);


var j = jfp;

if(typeof module !== 'undefined' && Boolean(module.exports)){
    // Node and CommonJS export
    module.exports = j;
} else if (typeof define === 'function' && Boolean(define.amd)) {
    // AMD and Require.js module definition
    define([], function () {
        return jfp;
    });
}


