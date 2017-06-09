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

    var signetDefinition = {
        alias: 'function',
        defineDependentOperatorOn: 'function',
        defineDuckType: 'function',
        extend: 'function',
        isTypeOf: 'function',
        subtype: 'function'
    };

    function checkConcatable(value) {
        return typeof value.concat === 'function';
    }

    function checkNil(value) {
        return value.length === 0;
    }

    function checkPair(value) {
        return value.length > 0;
    }

    function isSameType(a, b) {
        return typeof a === typeof b;
    }

    function setJfpTypes(__signet) {
        var numberPattern = '^[0-9]+((\\.[0-9]+)|(e\\-?[0-9]+))?$';

        __signet.subtype('array')('nil', checkNil);
        __signet.subtype('array')('pair', checkPair);
        __signet.defineDuckType('signet', signetDefinition);

        __signet.alias('defined', 'not<undefined>');
        __signet.subtype('defined')('concatable', checkConcatable);

        __signet.alias('natural', 'leftBoundedInt<0>')
        __signet.alias('index', 'natural');

        __signet.alias('comparable', 'variant<boolean, number, string>');
        __signet.alias('exists', 'not<variant<nil, null, undefined>>');
        __signet.alias('maybe', 'variant<null, _>');
        __signet.alias('notNull', 'not<null>');
        __signet.alias('notNil', 'not<nil>');
        __signet.alias('numeric', 'variant<number, formattedString<' + numberPattern + '>>');
        __signet.alias('objectInstance', 'composite<not<null>, object>')
        __signet.alias('objectKey', 'variant<string, symbol>');
        __signet.alias('predicate', 'function');
        __signet.alias('referencible', 'variant<objectInstance, string, function>');
        __signet.alias('typeString', 'string');

        __signet.defineDependentOperatorOn('concatable')('isTypeOf', isSameType);

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
        var checkType = _signet.isTypeOf(typeDef);

        return function (value) {
            return checkType(value) ? value : null;
        };
    }

    // Type system behaviors
    j.enforce = _signet.enforce;
    j.isTypeOf = _signet.isTypeOf;
    j.sign = _signet.sign;

    j.either = _signet.enforce('type => defaultValue:* => value:* => *', either);
    j.maybe = _signet.enforce('type => value:* => maybe<defined>', maybe);
    j.setJfpTypes = _signet.enforce('signet => signet', setJfpTypes);

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
        return concat(valuesB, valuesA);
    }

    function cons(value, values) {
        return typeof value === 'undefined' ? values : [value].concat(values);
    }

    function conj(value, values) {
        return typeof value === 'undefined' ? values : values.concat([value]);
    }

    function slice(start, end) {
        return function (valueSet) {
            return Array.prototype.slice.call(valueSet, start, end);
        };
    }

    var sliceFrom0 = slice(0);

    function apply(fn, args) {
        return fn.apply(null, args);
    }

    function pick(key) {
        return function (obj) {
            var result;

            try {
                result = j.maybeDefined(obj[key]);
            } catch (e) {
                result = null;
            }

            return result;
        };
    }

    var pickId = pick('id');

    function buildRecursor(result) {
        return function () {
            result.args = sliceFrom0(arguments);
            return result;
        }
    }

    function recur(fn) {
        // Each recursion needs to be signed to avoid collisions
        var id = Math.floor(Math.random() * 1000000);

        return function () {
            var result = {
                id: id,
                args: sliceFrom0(arguments)
            };
            var recursor = buildRecursor(result);

            while (pickId(result) === id) {
                result = apply(fn, [recursor].concat(result.args));
            }

            return result;
        };
    }

    function compose(f, g) {
        return function () {
            return f(g.apply(null, sliceFrom0(arguments)));
        };
    }

    function rcompose(g, f) {
        return compose(f, g);
    }

    function directionalCompose(composer) {
        return function (f, g) {
            var fns = sliceFrom0(arguments);
            var result = f;

            for (var i = 1; i < fns.length; i++) {
                result = composer(result, fns[i]);
            }

            return result;
        };
    }

    function reverseArgs(fn) {
        return function () {
            return apply(fn, sliceFrom0(arguments).reverse());
        };
    }

    function buildCurriable(fn, count, initialArgs) {
        return function curriable() {
            var args = concat(initialArgs, sliceFrom0(arguments));
            return !(args.length < count) ? apply(fn, args) : buildCurriable(fn, count, args);
        }
    }

    function curry(fn, count, args) {
        return buildCurriable(fn, j.eitherNatural(fn.length)(count), j.eitherArray([])(args));
    }

    var sliceRest = slice(1);

    function directionalPartial(concat) {
        return function (fn) {
            var args = sliceRest(arguments);

            return function () {
                return apply(fn, concat(args, sliceFrom0(arguments)));
            };
        };
    }

    var partial = directionalPartial(concat);
    var rpartial = directionalPartial(rconcat);

    function repeat(fn) {
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
    j.always = j.sign('value:* => [*] => value:*', always);
    j.apply = j.enforce('application:function, arguments:array<*> => result:*', apply);
    j.argumentsToArray = j.enforce('arguments => array', sliceFrom0);
    j.compose = j.enforce('f:function, g:function => fog:function', compose);
    j.concat = curry(j.enforce('A isTypeOf B :: A:concatable, B:concatable => concatenation:concatable', concat), 2);
    j.conj = j.enforce('value:*, values:array<*> => result:array<*>', conj);
    j.cons = j.enforce('value:*, values:array<*> => result:array<*>', cons);
    j.curry = j.enforce('toCurry:function, arity:[int], initialArgs:[array<*>] => additionalArgs:[*] => result:*', curry);
    j.foldlCompose = j.enforce('f:function, g:function => fog:function', directionalCompose(compose));
    j.foldrCompose = j.enforce('f:function, g:function => gof:function', directionalCompose(rcompose));
    j.identity = j.sign('value:* => value:*', identity);
    j.partial = j.enforce('application:function, applicationArguments:[*] => additionalArgs:[*] => result:*', partial);
    j.pick = j.enforce('key:string => value:* => result:maybe<defined>', pick);
    j.rcompose = j.enforce('f:function, g:function => gof:function', rcompose);
    j.recur = j.enforce('recursiveFn:function => recursorFn:function', recur);
    j.repeat = j.enforce('application:function => repeatCount:int => value:* => result:*', repeat);
    j.rpartial = j.enforce('application:function, applicationArguments:[*] => additionalArgs:[*] => result:*', rpartial);
    j.reverseArgs = j.enforce('originalFunction:function => reversedArgs:[*] => result:*', reverseArgs);
    j.slice = j.enforce('startIndex:int, endIndex:[int] => objectToSlice:variant<array;arguments> => result:array', slice);

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
            var i = min - offset;

            while (!((i += offset) > max)) {
                result.push(i)
            }

            return result;
        };
    }

    function min (a, b) { return less(a, b) ? a : b; }
    function max (a, b) { return greater(a, b) ? a : b; }

    function between(min, max) {
        return function (value) {
            return !(min > value || value > max);
        };
    }

    function notBetween(min, max) {
        var betweenVals = between(min, max);

        return function (value) {
            return !betweenVals(value);
        };
    }

    // Arithmetic
    j.add = j.enforce('a:number, b:number => sum:number', operation('+'));
    j.divide = j.enforce('a:number, b:number => quotient:number', operation('/'));
    j.mod = j.enforce('a:number, b:number => modulo:number', operation('%'));
    j.multiply = j.enforce('a:number, b:number => product:number', operation('*'));
    j.subtract = j.enforce('a:number, b:number => difference:number', operation('-'));

    j.addBy = j.enforce('a:number => b:number => sum:number', operateBy('+'));
    j.divideBy = j.enforce('b:number => a:number => quotient:number', operateBy('/'));
    j.modBy = j.enforce('b:number => a:number => modulo:number', operateBy('%'));
    j.multiplyBy = j.enforce('a:number => b:number => product:number', operateBy('*'));
    j.subtractBy = j.enforce('b:number => a:number => quotient:number', operateBy('-'));

    j.min = j.enforce('a:number, b:number => minimum:number', min);
    j.max = j.enforce('a:number, b:number => maximum:number', max);

    j.inc = j.enforce('a:int => sum:int', function (a) { return a + 1; });
    j.dec = j.enforce('a:int => difference:int', function (a) { return a - 1; });

    j.range = j.enforce('start:int, increment:[int] => end:int => range:array<int>', range);

    j.gt = j.enforce('a:number => b:number => result:boolean', curryOperation(greater));
    j.geq = j.enforce('a:number => b:number => result:boolean', curryOperation(greaterOrEqual));
    j.lt = j.enforce('a:number => b:number => result:boolean', curryOperation(less));
    j.leq = j.enforce('a:number => b:number => result:boolean', curryOperation(lessOrEqual));

    j.between = j.enforce('min < max :: min:number, max:number => value:number => result:boolean', between);
    j.notBetween = j.enforce('min < max :: min:number, max:number => value:number => result:boolean', notBetween);

})(jfp);

(function (j) {
    'use strict';

    function nth(index) {
        return function (values) {
            return j.maybeDefined(values[index]);
        };
    }

    function lastIndexOf(values) {
        return j.eitherNatural(0)(values.length - 1);
    }

    function dropNth(index) {
        return function (values) {
            var result = j.argumentsToArray(values);

            result.splice(index, 1);

            return result;
        };
    }

    var first = nth(0);
    var rest = j.slice(1);

    function dropLast(values) {
        return j.slice(0, lastIndexOf(values))(values);
    }

    function reverse(values) {
        return j.slice(0)(values).reverse();
    }

    function foldl(fn, initial) {
        return function (values) {
            var initialIsDefined = !j.isUndefined(initial);
            var result = initialIsDefined ? initial : first(values);
            var listLen = values.length;
            var i = initialIsDefined ? -1 : 0;

            while (++i < listLen) {
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


    j.all = j.enforce('predicate:function => values:array => result:boolean', all);
    j.compact = j.enforce('values:[array] => result:array', filter(Boolean));
    j.dropLast = j.enforce('values:array => result:array', dropLast);
    j.dropNth = j.enforce('dropIndex:index => values:array => result:array', dropNth);
    j.filter = j.enforce('predicate:function => values:array => result:array', filter);
    j.first = j.enforce('values:array => firstValue:maybe<defined>', first);
    j.find = j.enforce('predicate:function => values:array => foundValue:maybe<defined>', find);
    j.foldl = j.enforce('application:function, initialValue:[*] => values:array => result:*', foldl);
    j.foldr = j.enforce('application:function, initialValue:[*] => values:array => result:*', foldr);
    j.lastIndexOf = j.enforce('values:array => lastIndex:index', lastIndexOf);
    j.map = j.enforce('application:function => values:array => result:array', map);
    j.none = j.enforce('predicate:function => values:array => result:boolean', none);
    j.nth = j.enforce('valueIndex:index => values:array => result:maybe<defined>', nth);
    j.partition = j.enforce('predicate:function => values:array => partitionedValues:tuple<array;array>', partition);
    j.pushUnsafe = j.enforce('valueArray:array => pushValue:* => valueArray:array', pushUnsafe);
    j.rest = rest;
    j.reverse = j.enforce('values:array => result:array', reverse);
    j.rfilter = j.enforce('predicate:function => values:array => result:array', rfilter);
    j.rmap = j.enforce('application:function => values:array => result:array', rmap);
    j.rpartition = j.enforce('predicate:function => values:array => partitionedValues:array<array;array>', rpartition);
    j.rreduce = j.enforce('application:function, initialValue:[*] => values:array => result:*', rreduce);
    j.some = j.enforce('predicate:function => values:array => result:boolean', some);
    j.sort = j.enforce('comparator:[*] => values:array => sortedValues:array', sort);
    j.take = j.enforce('endIndex:[index] => function', take);
    j.takeUntil = j.enforce('predicate:function => values:array => result:array', takeUntil);
    j.until = j.enforce('predicate:function => application:function, initialValue:[*] => values:array => result:*', until);

})(jfp);


(function (j) {
    'use strict';

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

    function mergeToUnsafe(objA) {
        return function (objB) {
            var keys = Object.keys(objB);

            for(var i = 0; i < keys.length; i++) {
                objA[keys[i]] = objB[keys[i]];
            }

            return objA;
        };
    }

    function shallowClone(obj) {
        return mergeToUnsafe(j.isArray(obj) ? [] : {})(obj);
    }

    function merge(objA, objB) {
        return mergeToUnsafe(shallowClone(objA))(objB);
    }

    function getKeys(obj) {
        return Object.keys(obj);
    }

    function toArray(obj) {
        var keys = getKeys(obj);
        var result = [];

        for (var i = 0; i < keys.length; i++) {
            result.push([keys[i], obj[keys[i]]]);
        }

        return result;
    }

    function toValues(obj) {
        var keys = getKeys(obj);
        var result = [];

        for (var i = 0; i < keys.length; i++) {
            result.push(obj[keys[i]]);
        }

        return result;
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

    j.clone = j.enforce('original:object => clone:object', clone);
    j.deref = j.enforce('dataPath:string => object:* => result:maybe<defined>', deref);
    j.merge = j.enforce('A != B :: A:object, B:object => result:object', merge);
    j.mergeToUnsafe = j.enforce('a:object => b:object => a:object', mergeToUnsafe);
    j.shallowClone = j.enforce('original:object => clone:object', shallowClone);
    j.toArray = j.enforce('original:object => valuePairs:array<tuple<objectKey;*>>', toArray);
    j.toObject = j.enforce('valuePairs:array<tuple<objectKey;*>> => newObject:object', toObject);
    j.toValues = j.enforce('original:object => values:array<*>', toValues);

})(jfp);


(function (j) {
    'use strict';

    function buildThen(condResult) {
        return function (fn) {
            var args = arguments;

            return function () {
                var isFunction = typeof fn === 'function';
                
                condResult.action = isFunction ? fn : j.identity;
                condResult.args = j.slice(isFunction ? 1 : 0)(args);
            };
        }
    }

    function buildWhen(condResult) {
        return function (prop, captureBehavior) {
            if (condResult.action === null && prop) {
                captureBehavior();
            }
        };
    }

    function cond(condFn) {
        var condResult = {
            action: null,
            args: []
        };

        condFn(buildWhen(condResult), buildThen(condResult), true);

        if (condResult.action === null) {
            throw new Error('All possible conditions were not represented in ' + condFn.toString());
        }

        return j.apply(condResult.action, condResult.args);
    }

    j.cond = j.enforce('condFunction:function => result:*', cond);

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


