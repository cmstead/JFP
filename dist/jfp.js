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

    function setJfpTypes(_signet) {
        var numberPattern = '^[0-9]+((\\.[0-9]+)|(e\\-?[0-9]+))?$';
        _signet.subtype('array')('nil', checkNil);
        _signet.subtype('object')('arguments', checkArguments);
        _signet.subtype('object')('signet', checkSignet);

        _signet.alias('numeric', 'taggedUnion<number;formattedString<' + numberPattern + '>>');

        _signet.extend('maybe', checkMaybe);

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

    function concat (xs, ys) {
        var result = xs.slice(0);
        
        for(var i = 0; i < ys.length; i++) {
            result.push(ys[i]);
        }
        
        return result;
    }

    function cons (value, values){
        return j.isTypeOf('undefined')(value) ? values : concat([value], values);
    }

    function slice (start, valueSet, end) {
        return Array.prototype.slice.apply(valueSet, cons(start, cons(end, j.nil)));
    }
    
    function apply(fn, args) {
        return fn.apply(null, args);
    }
    
    function partial(direction) {
        var isLeft = direction === 'left';
        
        return function (fn) {
            var initial = slice(1, arguments);
            
            return function () {
                var remaining = slice(0, arguments);
                var argSet = isLeft ? [initial, remaining] : [remaining, initial];
                
                return apply(fn, apply(concat, argSet));
            };
        };
    }
    
    // JFP core functions
    j.always = j.enforce('* => () => *', always);
    j.apply = j.enforce('function, array<*> => *', apply);
    j.cons = j.enforce('*, array => array', cons);
    j.either = j.enforce('string => * => * => *', either);
    j.identity = j.enforce('* => *', identity);
    j.maybe = j.enforce('string => * => maybe<*>', maybe);
    j.partial = j.enforce('function, [*] => [*] => *', partial('left'));
    j.rpartial = j.enforce('function, [*] => [*] => *', partial('right'));
    j.slice = j.enforce('int, taggedUnion<array;arguments>, [int] => array', slice);

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


