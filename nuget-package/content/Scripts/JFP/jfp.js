var jfp = (function(){
    'use strict';
    
    // function resolveFunction(functionValue){
    //     return typeof functionValue === 'string' ? jfp[functionValue] : functionValue;
    // }
    
    // function curryAlias(){
    //     var args = jfp.slice(0, arguments);

    //     args[0] = resolveFunction(args[0]);
        
    //     return jfp.apply(jfp.curry, args);
    // }
    
    // function pickAlias(key, value){
    //     var cleanKey = key.slice(1);
        
    //     return Boolean(value) ? jfp.pick(cleanKey, value) : jfp.partial(jfp.pick, cleanKey);
    // }
    
    // function chooseResolver(value){
    //     var resolveToPick = typeof value === 'string' && value.charAt(0) === ':';
        
    //     return resolveToPick ? pickAlias : curryAlias;
    // }
    
    // return function(){
    //     var args = jfp.slice(0, arguments),
    //         resolver = chooseResolver(args[0]);
        
    //     return jfp.apply(resolver, args);
    // };
    
    return function () {};
    
})();

(function (j) {
    'use strict';

    var signet = typeof signet !== 'undefined' ? signet : require('signet')();

    function checkNil(value) {
        return value.length === 0 && Object.keys(value).length === 0;
    }

    function checkMaybe(value, typeObj) {
        return signet.isTypeOf(typeObj.valueType[0])(value) || checkNil(value);
    }

    function checkSignet(value) {
        var isFunction = signet.isTypeOf('function');

        return isFunction(value.subtype) &&
            isFunction(value.extend) &&
            isFunction(signet.isTypeOf);
    }

    function checkArguments(value) {
        return Object.prototype.toString.call(value) === '[object Arguments]';
    }

    function checkNull(value) {
        return value === null;
    }

    function checkDefined (value){
        return !signet.isTypeOf('undefined')(value);
    }

    function checkIndex (value){
        return value >= 0;
    }

    function setJfpTypes(_signet) {
        var numberPattern = '^[0-9]+((\\.[0-9]+)|(e\\-?[0-9]+))?$';
        _signet.subtype('array')('nil', checkNil);
        _signet.subtype('int')('index', checkIndex);
        _signet.subtype('object')('arguments', checkArguments);
        _signet.subtype('object')('signet', checkSignet);

        _signet.extend('maybe', checkMaybe);
        _signet.extend('null', checkNull);
        _signet.extend('defined', checkDefined);

        _signet.alias('numeric', 'taggedUnion<number;formattedString<' + numberPattern + '>>');
        _signet.alias('comparable', 'taggedUnion<boolean;number;string>');
        _signet.alias('objectKey', 'taggedUnion<string;symbol>');

        return _signet;
    }

    setJfpTypes(signet);

    Object.defineProperty(j, 'nil', {
        get: function () {
            return [];
        }
    });

    // Type system behaviors
    j.enforce = signet.enforce;
    j.isTypeOf = signet.isTypeOf;
    j.setJfpTypes = signet.enforce('signet => signet', setJfpTypes);


})(jfp);

(function (j) {
    'use strict';

    var isUndefined = j.isTypeOf('undefined');

    function identity(value) {
        return value;
    }

    function always(value) {
        return identity.bind(null, value);
    }

    function either(typeStr) {
        var checkType = j.isTypeOf(typeStr);

        return function (defaultValue) {
            return function (value) {
                return checkType(value) ? value : defaultValue;
            };
        };
    }

    function maybe(typeStr) {
        return either(typeStr)(j.nil);
    }

    function concat(valuesa, valuesb) {
        var result = valuesa.slice(0);

        for (var i = 0; i < valuesb.length; i++) {
            result.push(valuesb[i]);
        }

        return result;
    }

    function cons(value, values) {
        return isUndefined(value) ? values : concat([value], values);
    }

    function conj(value, values) {
        return isUndefined(value) ? values : concat(values, [value]);
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

    function recursor (id){
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
        var isNil = j.isTypeOf('nil');

        return function () {
            return recur(execCompose)(apply(fn, slice(0)(arguments)), fns);

            function execCompose(recur, result, fns) {
                return isNil(fns) ? result : recur(fns[0](result), slice(1)(fns));
            }
        };
    }

    function reverseArgs(fn) {
        return function () {
            return apply(fn, slice(0)(arguments).reverse());
        };
    }

    var maybeArray = maybe('array');
    var eitherInt = either('int');

    function attachCurryData (curriable, fn, count, args){
        Object.defineProperty(curriable, 'fnLength', {
            value: eitherInt(fn.length)(count),
            writeable: false
        });
        
        curriable.fn = fn;
        curriable.args = maybeArray(args);

        return curriable;
    }

    function directionalCurry (directionalConcat) {
        var curry = function (fn, count, args) {
            
            var curriable = function () {
                var args = directionalConcat(curriable.args, slice(0)(arguments));
                var done = curriable.fnLength <= args.length;

                return done ? apply(curriable.fn, args) : curry(fn, curriable.fnLength, args);
            };

            return attachCurryData(curriable, fn, count, args);
        };
        
        return curry;
    }

    function directionalPartial (directionalConcat){
        return function (fn) {
            var args = slice(1)(arguments);

            return function () {
                return apply(fn, directionalConcat(args, slice(0)(arguments)));
            };        
        };
    }

    // JFP core functions
    j.always = j.enforce('* => [*] => *', always);
    j.apply = j.enforce('function, array<*> => *', apply);
    j.compose = j.enforce('[function] => function', compose);
    j.concat = j.enforce('array<*>, array<*> => array<*>', concat);
    j.conj = j.enforce('*, array<*> => array<*>', conj);
    j.cons = j.enforce('*, array<*> => array<*>', cons);
    j.curry = j.enforce('function, [int], [array<*>] => [*] => *', directionalCurry(concat));
    j.rcurry = j.enforce('function, [int], [array<*>] => [*] => *', directionalCurry(reverseArgs(concat)));
    j.either = j.enforce('string => * => * => *', either);
    j.identity = j.enforce('* => *', identity);
    j.maybe = j.enforce('string => * => maybe<defined>', maybe);
    j.partial = j.enforce('function, [*] => [*] => *', directionalPartial(concat));
    j.recur = j.enforce('function => function', recur);
    j.rpartial = j.enforce('function, [*] => [*] => *', directionalPartial(reverseArgs(concat)));
    j.reverseArgs = j.enforce('function => [*] => *', reverseArgs);
    j.slice = j.enforce('int, [int] => taggedUnion<array<*>;arguments> => array<*>', slice);

})(jfp);

(function (j) {
    'use strict';

    function equal(a, b) {
        return a === b;
    }

    function not(a) {
        return !a;
    }

    function invert(pred) {
        return j.compose(j.not, pred);
    }

    function and (a, b){
        return Boolean(a && b);
    }
    
    function or (a, b){
        return Boolean(a || b);
    }
    
    function xor (a, b) {
        return Boolean(a ? !b : b);
    }

    var isUndefined = j.isTypeOf('undefined');

    function operationCurry (fn){
        return function (a, b) {
            return isUndefined(b) ? function (c) { return fn(a, c); } : fn(a, b);
        };
    }

    var currySignature = 'comparable, [comparable] => taggedUnion<function<comparable>;boolean>';

    j.invert = j.enforce('function => function', invert);
    j.equal = j.enforce(currySignature, operationCurry(equal));
    j.and = j.enforce(currySignature, operationCurry(and));
    j.or = j.enforce(currySignature, operationCurry(or));
    j.xor = j.enforce(currySignature, operationCurry(xor));
    j.not = j.enforce('comparable => boolean', not);

    j.isNil = j.isTypeOf('nil');
    j.isUndefined = j.isTypeOf('undefined');

})(jfp);

(function (j) {
    'use strict';

    var isNil = j.isTypeOf('nil');

    function nth(index) {
        return function (values) {
            return j.maybe('defined')(values[index]);
        };
    }

    function lastIndexOf(values) {
        var length = values.length;
        return length === 0 ? length : length - 1;
    }

    function dropNth(index) {
        return function (values) {
            var result = j.slice(0)(values);
            result.splice(index, 1);
            return result;
        };
    }

    function reverse(values) {
        return j.recur(reverser)([], values);

        function reverser(recur, result, valueSet) {
            return !isNil(valueSet) ?
                recur(j.cons(j.first(valueSet), result), j.rest(valueSet)) :
                result;
        }
    }

    function folder(fn) {
        return j.recur(function (recur, result, values) {
            return isNil(values) ? result : recur(fn(result, j.first(values)), j.rest(values));
        });
    }

    function fold(direction) {
        return function (fn, initial) {
            return function (values) {
                var noInitial = j.isTypeOf('undefined')(initial);
                var valueSet = direction === 'left' ? values : reverse(values);

                var value = noInitial ? j.first(valueSet) : initial;
                var list = noInitial ? j.rest(valueSet) : valueSet;

                return folder(fn)(value, list);
            };
        };
    }

    function foldApplicator(behavior) {
        return function (fn) {
            return function (values) {
                return fold('left')(behavior(fn), [])(values);
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

    function find (pred){
        return function (values) {
            return j.recur(finder)(values);
            
            function finder (recur, values){
                var value = j.first(values);
                return isNil(values) || pred(value) ? value : recur(j.rest(values));
            }
        };
    }

    function some(pred) {
        return j.recur(check);

        function check(recur, values) {
            var match = pred(j.first(values));
            var done = isNil(values);

            return match || done ? match && !done : recur(j.rest(values));
        }
    }

    function sort (comparator){
        return function (values) {
            var valuesCopy = j.slice(0)(values);

            if(j.isTypeOf('function')(comparator)) {
                valuesCopy.sort(comparator);
            } else {
                valuesCopy.sort();
            }

            return valuesCopy; 
        };
    }

    function none(pred) { return j.compose(j.invert, some)(pred); }
    function all(pred) { return j.compose(none, j.invert)(pred); }
    function take(count) { return j.slice(0, count); }

    var filter = foldApplicator(filterer);
    var map = foldApplicator(mapper);

    j.all = j.enforce('function => array<*> => boolean', all);
    j.compact = j.enforce('[array] => array<*>', filter(Boolean));
    j.dropNth = j.enforce('index => array<*> => array<*>', dropNth);
    j.filter = j.enforce('function => array<*> => array<*>', filter);
    j.first = j.enforce('array<*> => maybe<defined>', nth(0));
    j.find = j.enforce('function<*> => array<*> => maybe<defined>', find);
    j.foldl = j.enforce('function, [*] => array<*> => *', fold('left'));
    j.foldr = j.enforce('function, [*] => array<*> => *', fold('right'));
    j.lastIndexOf = j.enforce('array<*> => index', lastIndexOf);
    j.map = j.enforce('function => array<*> => array<*>', map);
    j.none = j.enforce('function => array<*> => boolean', none);
    j.nth = j.enforce('index => array<*> => maybe<defined>', nth);
    j.rest = j.slice(1);
    j.reverse = j.enforce('array<*> => array<*>', reverse);
    j.some = j.enforce('function => array<*> => boolean', some);
    j.sort = j.enforce('[*] => array<*> => array<*>', sort);
    j.take = j.enforce('[index] => function<array<*>>', take);

})(jfp);

(function (j) {
    'use strict';

    var isUndefined = j.isTypeOf('undefined');

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
                default:
                    return new Error('Bad operator');
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

    function operationCurry(operation) {
        return function (a) {
            var b = arguments[1];
            return isUndefined(b) ? function (b) { return operation(a, b); } : operation(a, b);
        };
    }

    function range(min, increment) {
        var offset = isUndefined(increment) ? 1 : increment;
        
        return function (max) {
            return j.recur(buildRange)(min, []);

            function buildRange(recur, value, output) {
                return value > max ? output : recur(value + offset, j.conj(value, output));
            }
        };
    }

    function max (a, b){
        return a > b ? a : b;
    }
    
    function min (a, b){
        return a < b ? a : b;
    }

    function equal(a, b) {
        return a === b;
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

    j.addBy = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(j.add));
    j.divideBy = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(j.reverseArgs(j.divide)));
    j.modBy = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(j.reverseArgs(j.mod)));
    j.multiplyBy = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(j.multiply));
    j.subtractBy = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(j.reverseArgs(j.subtract)));

    j.min = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(min));
    j.max = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(max));

    j.inc = j.enforce('[int] => int', operationCurry(j.add)(1));
    j.dec = j.enforce('[int] => int', operationCurry(j.add)(-1));

    j.range = j.enforce('int, [int] => int => array<int>', range);
    
    j.gt = j.enforce('number => number => boolean', compare('>'));
    j.geq = j.enforce('number => number => boolean', compare('>='));
    j.lt = j.enforce('number => number => boolean', compare('<'));
    j.leq = j.enforce('number => number => boolean', compare('<='));
    j.between = j.enforce('number, number => number => boolean', between);

})(jfp);

(function (j) {
    'use strict';

    var maybeDefined = j.maybe('defined');

    function pick(key) {
        return function (obj) {
            return maybeDefined(obj[key]);
        };
    }

    function deref(key) {
        var keyTokens = key.split('.');

        return function (obj) {
            return j.recur(derefStep)(obj, keyTokens);

            function derefStep(recur, obj, keyTokens) {
                var key = j.first(keyTokens);

                return j.isNil(keyTokens) ? obj : recur(pick(key)(obj), j.rest(keyTokens));
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
        return j.recur(convertKeys)([], Object.keys(obj));

        function convertKeys(recur, result, keys) {
            var key = j.first(keys);
            return j.isNil(keys) ? result : recur(j.conj([key, obj[key]], result), j.rest(keys));
        }
    }

    var second = j.nth(1);

    function addRecord(obj, record) {
        obj[j.first(record)] = second(record);

        return obj;
    }

    function toObject(tupleArray) {
        return j.recur(convertTuples)({}, tupleArray);

        function convertTuples(recur, result, objTuples) {
            var next = j.rcurry (recur, 2) (j.rest(objTuples));
            var updateObj = j.compose(j.curry (addRecord) (result), j.first);
            
            return j.cond(function (when, then, _default) {
                when(j.isNil(objTuples), then(result));
                when(_default, then(j.compose(next, updateObj), objTuples));
            });
        }
    }

    j.pick = j.enforce('string => object => maybe<defined>', pick);
    j.deref = j.enforce('string => object => maybe<defined>', deref);
    j.merge = j.enforce('object, object => object', merge);
    j.toArray = j.enforce('object => array<tuple<objectKey;*>>', toArray);
    j.toObject = j.enforce('array<tuple<objectKey;*>> => object', toObject);

})(jfp);

(function (j) {
    'use strict';
    
    var isFunction = j.isTypeOf('function');
    
    function then (fn){
        var index = isFunction(fn) ? 1 : 0;
        var action = index === 1 ? fn : j.identity;
        
        return [action, j.slice(index)(arguments)];
    }
    
    function when (condArray){
        return function (prop, behavior) {
            condArray.push([prop, behavior]);
        };
    }
    
    var isResult = j.compose(Boolean, j.first);
    
    function throwOnNil (result, condFn){
        if(j.isNil(result)) {
            throw new Error('All possible conditions were not represented in ' + condFn.toString());
        }
    }

    function callBehavior (behavior){
        var fn = behavior[0];
        var args = behavior[1];
        
        return j.apply(fn, args);
    }
    
    function cond (condFn){
        var condArray = [];
        
        condFn(when(condArray), then, true);
                
        var result = j.find(isResult)(condArray);
        var behavior = result[1];
        
        throwOnNil(result, condFn);
        
        return callBehavior(behavior);
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


