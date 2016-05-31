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
        return j.isTypeOf('undefined')(value) ? values : concat([value], values);
    }

    function slice (start){
        return function (valueSet, end) {
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
    
    // JFP core functions
    j.always = j.enforce('* => [*] => *', always);
    j.apply = j.enforce('function, array<*> => *', apply);
    j.cons = j.enforce('*, array<*> => array<*>', cons);
    j.either = j.enforce('string => * => * => *', either);
    j.identity = j.enforce('* => *', identity);
    j.maybe = j.enforce('string => * => maybe<*>', maybe);
    j.partial = j.enforce('function, [*] => [*] => *', partial('left'));
    j.recur = j.enforce('function => [*] => *', recur);
    j.rpartial = j.enforce('function, [*] => [*] => *', partial('right'));
    j.slice = j.enforce('int => taggedUnion<array<*>;arguments>, [int] => array<*>', slice);

})(jfp);

(function (j) {
    'use strict';
    
    function equal (a, b){
        return a === b;
    }
    
    function not (a) {
        return !a;
    }
    
    j.equal = j.enforce('comparable, comparable => boolean', equal);
    j.not = j.enforce('boolean => boolean', not);
    
})(jfp);

(function (j) {
    'use strict';

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
            return j.slice(0)(values, count);
        };
    }

    function drop(index) {
        return function (values) {
            var result = j.slice(0)(values);
            result.splice(index, 1);
            return result;
        };
    }

    function folder(fn) {
        var isNil = j.isTypeOf('nil');

        return j.recur(function (recur, result, values) {
            return isNil(values) ? result : recur(fn(result, j.first(values)), j.rest(values));
        });
    }

    function fold(direction) {
        return function (initial){
            return function (fn) {
                return function (values) {
                    return direction === 'left' ? 
                        folder(fn)(initial, values) :
                        folder(fn)(initial, values.reverse());
                };
            };
        };
    }

    j.drop = j.enforce('index => array<*> => array<*>', drop);
    j.first = j.enforce('array<*> => maybe<*>', nth(0));
    j.foldl = j.enforce('* => function => array<*> => *', fold('left'));
    j.foldr = j.enforce('* => function => array<*> => *', fold('right'));
    j.lastIndexOf = j.enforce('array<*> => index', lastIndexOf);
    j.nth = j.enforce('index => array<*> => maybe<*>', nth);
    j.rest = j.slice(1);
    j.take = j.enforce('index => array<*> => array<*>', take);

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


