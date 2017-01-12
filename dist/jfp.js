var jfp = (function(){
    'use strict';
    
    return function () {};
    
})();

(function (j) {
    'use strict';

    var _signet = typeof signet !== 'undefined' ? signet : null;

    if(typeof require === 'function') {
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

    function checkDefined (value){
        return !isUndefined(value) && checkNotNull(value);
    }

    function checkExists(value) {
        return checkNotNull(value) &&
            checkNotNil(value) &&
            checkDefined(value);
    }

    function checkNatural (value){
        return value >= 0;
    }

    function checkPair (value){
        return value.length > 0;
    }

    function checkConcatable (value) {
        return checkDefined(value) && checkNotNull(value) && isFunction(value.concat);
    }

    function checkObjectInstance (value) {
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
        var checkType = isFunction(typeDef) ? typeDef : _signet.isTypeOf(typeDef);

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
    j.either = either;
    j.enforce = _signet.enforce;
    j.isTypeOf = _signet.isTypeOf;
    j.maybe = maybe;
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
    j.eitherReferencible = either('referencible');

    j.eitherDefined = either('defined');
    j.eitherNotNull = either('notNull');

    j.maybeDefined = maybe('defined');


})(jfp);

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

(function (j) {
    'use strict';

    function identity(value) {
        return value;
    }

    function always(value) {
        return identity.bind(null, value);
    }

    function concat(valuesA, valuesB) {
        return j.eitherConcatable([])(valuesA).concat(valuesB);
    }

    function cons(value, values) {
        return j.isUndefined(value) ? values : concat([value], values);
    }

    function conj(value, values) {
        return j.isUndefined(value) ? values : concat(values, [value]);
    }

    function slice(start, end) {
        return function (valueSet) {
            return Array.prototype.slice.apply(valueSet, cons(start, cons(end, j.nil)));
        };
    }

    function apply(fn, args) {
        return fn.apply(null, args);
    }

    function RecurObj(id, args) {
        this.id = id;
        this.args = args;
    }

    function recursor(id) {
        return function () {
            return new RecurObj(id, slice(0)(arguments));
        };
    }

    function recur(fn) {
        // Each recursion needs to be signed to avoid collisions
        var id = Math.floor(Math.random() * 1000000);
        var signedRecursor = recursor(id);

        return function () {
            var result = apply(signedRecursor, slice(0)(arguments));

            while (result instanceof RecurObj && result.id === id) {
                result = apply(fn, cons(signedRecursor, result.args));
            }

            return result;
        };
    }

    function compose() {
        var fns = slice(0)(arguments).reverse();
        var fn = fns.shift();

        return function () {
            return recur(execCompose)(apply(fn, slice(0)(arguments)), fns);

            function execCompose(recur, result, fns) {
                return j.isNil(fns) ? result : recur(fns[0](result), slice(1)(fns));
            }
        };
    }

    function reverseArgs(fn) {
        return function () {
            return apply(fn, slice(0)(arguments).reverse());
        };
    }

    function attachCurryData(curriable, fn, count, args) {
        Object.defineProperty(curriable, 'fnLength', {
            value: j.eitherInt(fn.length)(count),
            writeable: false
        });

        curriable.fn = fn;
        curriable.args = j.eitherArray([])(args);

        return curriable;
    }

    function directionalCurry(directedConcat) {
        return function curry(fn, count, args) {

            var curriable = function () {
                var args = directedConcat(curriable.args, slice(0)(arguments));
                var done = curriable.fnLength <= args.length;

                return done ? apply(curriable.fn, args) : directionalCurry(directedConcat)(fn, curriable.fnLength, args);
            };

            return attachCurryData(curriable, fn, count, args);
        };
    }

    var curry = directionalCurry(concat);

    function directionalPartial(directionalConcat) {
        return function (fn) {
            var args = slice(1)(arguments);

            return function () {
                return apply(fn, directionalConcat(args, slice(0)(arguments)));
            };
        };
    }

    var partial = directionalPartial(concat);

    function repeat(fn) {
        function repeater (recur, count, value) {
            return count < 1 ? value : recur(count - 1, fn(value));
        }

        return curry(partial, 2)(recur(repeater));
    }

    // JFP core functions
    j.always = j.enforce('* => [*] => *', always);
    j.apply = j.enforce('function, array<*> => *', apply);
    j.compose = j.enforce('[function] => function', compose);
    j.concat = curry(j.enforce('concatable, concatable => concatable', concat), 2);
    j.conj = j.enforce('*, array<*> => array<*>', conj);
    j.cons = j.enforce('*, array<*> => array<*>', cons);
    j.curry = j.enforce('function, [int], [array<*>] => [*] => *', curry);
    j.rcurry = j.enforce('function, [int], [array<*>] => [*] => *', directionalCurry(reverseArgs(concat)));
    j.identity = j.enforce('* => *', identity);
    j.partial = j.enforce('function, [*] => [*] => *', partial);
    j.recur = j.enforce('function => function', recur);
    j.repeat = j.enforce('function => int => * => *', repeat);
    j.rpartial = j.enforce('function, [*] => [*] => *', directionalPartial(reverseArgs(concat)));
    j.reverseArgs = j.enforce('function => [*] => *', reverseArgs);
    j.slice = j.enforce('int, [int] => variant<array;arguments> => array', slice);

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
            var result = j.slice(0)(values);
            result.splice(index, 1);
            return result;
        };
    }

    var first = nth(0);
    var rest = j.slice(1);

    function isFoldBreak(value) {
        return typeof value === 'undefined' || 
            value === null || 
            value === false;
    }

    function reverse(values) {
        return j.slice(0)(values).reverse();
    }

    function folder(fn) {
        return j.recur(function (recur, result, values) {
            return j.isNil(values) || isFoldBreak(result) ? result : recur(fn(result, first(values)), rest(values));
        });
    }

    function fold(directionProcess) {
        return function (fn, initial) {
            return function (values) {
                var valueSet = directionProcess(values);

                var value = j.isUndefined(initial) ? first(valueSet) : initial;
                var list = j.isUndefined(initial) ? rest(valueSet) : valueSet;

                return folder(fn)(value, list);
            };
        };
    }

    function operationApplicator(operation) {
        return function (behavior, initial) {
            return function (fn) {
                return function (values) {
                    return operation(behavior(fn), initial)(values);
                };
            };
        };
    }

    function filterer(pred) {
        return function (result, value) {
            return pred(value) ? j.conj(value, result) : result;
        };
    }

    function mapper(fn) {
        return function (result, value) {
            return j.conj(fn(value), result);
        };
    }

    function partitioner(pred) {
        return function (result, value) {
            var index = pred(value) ? 0 : 1;
            result[index] = j.conj(value, result[index]);
            return result;
        };
    }

    function find(pred) {
        return function (values) {
            return j.recur(finder)(values);

            function finder(recur, values) {
                var value = first(values);
                return j.isNil(values) || pred(value) ? value : recur(rest(values));
            }
        };
    }

    var foldApplicator = operationApplicator(fold(j.identity));
    var filter = foldApplicator(filterer, []);
    var map = foldApplicator(mapper, []);
    var partition = foldApplicator(partitioner, [[], []]);

    function rreduceRecur (recur, fn, lastResult, values) {
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

    function some(pred) {
        return function (values) {
            return filter(pred)(values).length > 0;
        };
    }

    function none(pred) { return j.compose(j.invert, some)(pred); }
    function all(pred) { return j.compose(none, j.invert)(pred); }
    function take(count) { return j.slice(0, count); }

    j.all = j.enforce('function => array<*> => boolean', all);
    j.compact = j.enforce('[array] => array<*>', filter(Boolean));
    j.dropNth = j.enforce('index => array<*> => array<*>', dropNth);
    j.filter = j.enforce('function => array<*> => array<*>', filter);
    j.first = j.enforce('array<*> => maybe<defined>', first);
    j.find = j.enforce('function<*> => array<*> => maybe<defined>', find);
    j.foldl = j.enforce('function, [*] => array<*> => *', fold(j.identity));
    j.foldr = j.enforce('function, [*] => array<*> => *', fold(reverse));
    j.lastIndexOf = j.enforce('array<*> => index', lastIndexOf);
    j.map = j.enforce('function => array<*> => array<*>', map);
    j.none = j.enforce('function => array<*> => boolean', none);
    j.nth = j.enforce('index => array<*> => maybe<defined>', nth);
    j.partition = j.enforce('function => array<*> => array<array<*>;array<*>>', partition);
    j.rest = rest;
    j.reverse = j.enforce('array<*> => array<*>', reverse);
    j.rfilter = j.enforce('function => array<*> => array<*>', rfilter);
    j.rmap = j.enforce('function => array<*> => array<*>', rmap);
    j.rpartition = j.enforce('function => array<*> => array<array<*>;array<*>>', rpartition);
    j.rreduce = j.enforce('function, [*] => array<*> => *', rreduce);
    j.some = j.enforce('function => array<*> => boolean', some);
    j.sort = j.enforce('[*] => array<*> => array<*>', sort);
    j.take = j.enforce('[index] => function<array<*>>', take);

})(jfp);

(function (j) {
    'use strict';

    function operation (operator){
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

    function compare (operator){
        return function (a) {
            return function (b) {
                switch(operator) {
                    case '>':
                        return a > b;
                    case '<':
                        return a < b;
                    case '>=':
                        return a >= b;
                    case '<=':
                        return a <= b;
                }
            };
        };
    }

    function operateBy (operator){
        return function (a) {
            return function (b){
                return operation(operator)(b, a);
            };
        };
    }

    function range(min, increment) {
        var offset = j.isUndefined(increment) ? 1 : increment;
        
        return function (max) {
            return j.recur(buildRange)(min, []);

            function buildRange(recur, value, output) {
                return value > max ? output : recur(value + offset, j.conj(value, output));
            }
        };
    }

    function extrema (comparator){
        return function (a, b) {
            return comparator(a)(b) ? a : b;
        };
    }

    function between (min, max){
        if(min >= max) {
            throw new Error('Invalid range, ' + min + ' is not less than ' + max);
        }
        
        return function (value) {
            return min <= value && value <= max;
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

    j.min = j.enforce('number, number => number', extrema(compare('<')));
    j.max = j.enforce('number, number => number', extrema(compare('>')));

    j.inc = j.enforce('int => int', function (a) { return a + 1; });
    j.dec = j.enforce('int => int', function (a) { return a - 1; });

    j.range = j.enforce('int, [int] => int => array<int>', range);
    
    j.gt = j.enforce('number => number => boolean', compare('>'));
    j.geq = j.enforce('number => number => boolean', compare('>='));
    j.lt = j.enforce('number => number => boolean', compare('<'));
    j.leq = j.enforce('number => number => boolean', compare('<='));
    j.between = j.enforce('number, number => number => boolean', between);

})(jfp);

(function (j) {
    'use strict';

    function pick(key) {
        return function (obj) {
            return j.maybeDefined(j.eitherReferencible({})(obj)[key]);
        };
    }

    function pickByObj (obj){
        return function (key){
            return pick(key)(obj);
        };
    }

    function deref(key) {
        var keyTokens = key.split('.');

        return function (obj) {
            return j.foldl(pickKey, obj)(keyTokens);

            function pickKey(result, key) {
                return pick(key)(result);
            }
        };
    }

    function setValue(obj) {
        return function (result, key) {
            result[key] = obj[key];
            return result;
        };
    }

    function merge(objA, objB) {
        var newObj = j.foldl(setValue(objA), {})(Object.keys(objA));
        return j.foldl(setValue(objB), newObj)(Object.keys(objB));
    }

    function toArray(obj) {
        var pickKey = pickByObj(obj);
        return j.map(captureTuple)(Object.keys(obj));

        function captureTuple(key) {
            return [key, pickKey(key)];
        }
    }

    function toValues(obj) {
        return j.map(pickByObj(obj))(Object.keys(obj));
    }

    var second = j.nth(1);

    function addProperty(obj, propertyPair) {
        obj[propertyPair[0]] = propertyPair[1];
        return obj;
    }

    function toObject(tupleArray) {
        return j.foldl(addProperty, {})(tupleArray);
    }

    j.pick = j.enforce('string => * => maybe<defined>', pick);
    j.deref = j.enforce('string => * => maybe<defined>', deref);
    j.merge = j.enforce('object, object => object', merge);
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
        return function (prop, behavior) {
            if (Boolean(prop)) {
                condArray.push(behavior);
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
        throwOnNil(result);

        var result = j.first(resultSet);

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


