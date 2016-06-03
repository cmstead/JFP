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
        _signet.alias('comparable', 'taggedUnion<boolean;number;string;symbol;null>');

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

    function identity (value){
        return value;
    }

    function always (value){
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

    function concat (valuesa, valuesb) {
        var result = valuesa.slice(0);
        
        for(var i = 0; i < valuesb.length; i++) {
            result.push(valuesb[i]);
        }
        
        return result;
    }

    function cons (value, values){
        return isUndefined(value) ? values : concat([value], values);
    }
    
    function conj (value, values){
        return isUndefined(value) ? values : concat(values, [value]);
    }

    function slice (start, end){
        return function (valueSet) {
            return Array.prototype.slice.apply(valueSet, cons(start, cons(end, j.nil)));
        };
    }
    
    function apply(fn, args) {
        return fn.apply(null, args);
    }
    
    function partial(direction) {
        var isLeft = direction === 'left';
        
        return function (fn) {
            var initial = slice(1)(arguments);
            
            return function () {
                var remaining = slice(0)(arguments);
                var argSet = isLeft ? [initial, remaining] : [remaining, initial];
                
                return apply(fn, apply(concat, argSet));
            };
        };
    }
    
    function RecurObj (args){
        this.args = args;
    }
    
    function recursor (){
        return new RecurObj(slice(0)(arguments));
    }
    
    function recur (fn){
        return function () {
            var result = apply(recursor, slice(0)(arguments));
            
            while (result instanceof RecurObj) {
                result = apply(fn, cons(recursor, result.args));
            }
            
            return result;
        };
    }
    
    function compose (){
        var fns = slice(0)(arguments).reverse();
        var fn = fns.shift();
        var isNil = j.isTypeOf('nil');
        
        return function () {
            return recur(execCompose)(apply(fn, slice(0)(arguments)), fns);
            
            function execCompose (recur, result, fns){
                return isNil(fns) ? result : recur(fns[0](result), slice(1)(fns));
            }
        };
    }
    
    function curry (fn, count, args){
        var curriable = function (){
            var args = concat(curriable.args, slice(0)(arguments));
            var done = curriable.fnLength <= args.length;
            
            return done ? apply(curriable.fn, args) : curry(fn, curriable.fnLength, args); 
        };
        
        curriable.fn = fn;
        curriable.args = maybe('array')(args);
        
        Object.defineProperty(curriable, 'fnLength', {
            value: isUndefined(count) ? fn.length : count,
            writeable: false
        });
        
        return curriable;
    }
    
    // JFP core functions
    j.always = j.enforce('* => [*] => *', always);
    j.apply = j.enforce('function, array<*> => *', apply);
    j.compose = j.enforce('[function] => function', compose);
    j.concat = j.enforce('array<*>, array<*> => array<*>', concat);
    j.conj = j.enforce('*, array<*> => array<*>', conj);
    j.cons = j.enforce('*, array<*> => array<*>', cons);
    j.curry = j.enforce('function, [int], [array<*>] => [*] => *', curry);
    j.either = j.enforce('string => * => * => *', either);
    j.identity = j.enforce('* => *', identity);
    j.maybe = j.enforce('string => * => maybe<*>', maybe);
    j.partial = j.enforce('function, [*] => function', partial('left'));
    j.recur = j.enforce('function => function', recur);
    j.rpartial = j.enforce('function, [*] => function', partial('right'));
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



    j.equal = j.enforce('comparable, comparable => boolean', equal);
    j.invert = j.enforce('function => function', invert);
    j.not = j.enforce('boolean => boolean', not);

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

    function take(count) {
        return function (values) {
            return j.slice(0, count)(values);
        };
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

    function some(pred) {
        return j.recur(check);

        function check(recur, values) {
            var match = pred(j.first(values));
            var done = isNil(values);

            return match || done ? match && !done : recur(j.rest(values));
        }
    }

    var none = function (pred) { return j.compose(j.invert, some)(pred); };
    var all = function (pred) { return j.compose(none, j.invert)(pred); };

    var filter = foldApplicator(filterer);
    var map = foldApplicator(mapper);

    j.all = j.enforce('function => array<*> => boolean', all);
    j.dropNth = j.enforce('index => array<*> => array<*>', dropNth);
    j.filter = j.enforce('function => array<*> => array<*>', filter);
    j.first = j.enforce('array<*> => maybe<*>', nth(0));
    j.foldl = j.enforce('function, [*] => array<*> => *', fold('left'));
    j.foldr = j.enforce('function, [*] => array<*> => *', fold('right'));
    j.lastIndexOf = j.enforce('array<*> => index', lastIndexOf);
    j.map = j.enforce('function => array<*> => array<*>', map);
    j.none = j.enforce('function => array<*> => boolean', none);
    j.nth = j.enforce('index => array<*> => maybe<*>', nth);
    j.rest = j.slice(1);
    j.reverse = j.enforce('array<*> => array<*>', reverse);
    j.some = j.enforce('function => array<*> => boolean', some);
    j.take = j.enforce('index => array<*> => array<*>', take);

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

    function reverse (fn){
        return function (a, b) {
            return fn(b, a);
        };
    }

    function curry(operation) {
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

    j.addBy = j.enforce('number => number => number', curry(j.add));
    j.divideBy = j.enforce('number => number => number', curry(reverse(j.divide)));
    j.modBy = j.enforce('number => number => number', curry(reverse(j.mod)));
    j.multiplyBy = j.enforce('number => number => number', curry(j.multiply));
    j.subtractBy = j.enforce('number => number => number', curry(reverse(j.subtract)));

    j.min = j.enforce('number, [number] => taggedUnion<function;number>', curry(min));
    j.max = j.enforce('number, [number] => taggedUnion<function;number>', curry(max));

    j.inc = j.enforce('int => int', curry(j.add)(1));
    j.dec = j.enforce('int => int', curry(j.add)(-1));

    j.range = j.enforce('int, [int] => int => array<int>', range);
    
    j.gt = j.enforce('number => number => boolean', compare('>'));
    j.geq = j.enforce('number => number => boolean', compare('>='));
    j.lt = j.enforce('number => number => boolean', compare('<'));
    j.leq = j.enforce('number => number => boolean', compare('<='));
    j.equal = j.enforce('number, [number] => taggedUnion<function;boolean>', curry(equal));
    j.between = j.enforce('number, number => number => boolean', between);

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


