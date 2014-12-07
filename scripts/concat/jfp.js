jfp = (function(){
    'use strict';

    return {};

})();

var j = jfp;

(function(j){
    'use strict';

    //These array-related functions are critical to core behaviors
    function concat(original, extension){
        var result = j.either([], original),
            sanitizedExtension = j.either([], extension),
            i;

        //This is the most performant way to perform this concatenation. Trust me.
        for(i = 0; i < sanitizedExtension.length; i++){
            result.push(sanitizedExtension[i]);
        }

        return result;
    }
    
    function slice(index, valueSet){
        return Array.prototype.slice.call(valueSet, index);
    }

    //Begin function-related core code
    function identity(value){
        return value;
    }

    function maybe(defaultValue, userFn, optionValue){
        return (!(optionValue === undefined || optionValue === null || optionValue === '')) ?
                userFn(optionValue) : 
                defaultValue;
    }

    function either(defaultValue, optionValue){
        return maybe(defaultValue, identity, optionValue);
    }

    function countArguments(userFn){
        var params = either(function(){}, userFn).toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
            .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
            .split(/,/);

        params = (params.length === 1 && params[0] === '') ? [] : params;

        return params.length;
    }

    function apply(values, userFn){
        return userFn.apply(null, either([], values));
    }
    
    function partial(userFn){
        var args = slice(1, arguments);
        
        return function appliedFn(){
            return apply(concat(args, slice(0, arguments)), userFn);
        };
    }

    function rpartial(userFn){
        var args = slice(1, arguments);
        
        return function appliedFn(){
            return apply(concat(slice(0, arguments), args), userFn);
        };
    }

    function compose(userFn){
        var userFns = slice(0, arguments);

        return function(){
            var args = slice(0, arguments),
                result = either([], args),
                userFn;

            while(!!(userFn = userFns.pop())){
                result = [apply(result, userFn)];
            }

            return either([], result)[0];
        };
    }

    //This is complicated and I don't expect people to grok it on first read.
    function curry(userFn){
        var args = slice(1, arguments),
            argumentCount = maybe(0, countArguments, userFn),
            appliedFn = (args.length < argumentCount) ? apply(concat([curry], slice(0, arguments)), partial) : null,
            result = (!!userFn && args.length >= argumentCount) ? apply(args, userFn) : null;

        return j.either(appliedFn, result);
    }

    //zOMG! TAIL RECURSION
    function recur(userFn){
        var recurFn = either(identity, userFn),
            recurser = function(){
                return apply(concat([recurFn], slice(0, arguments)), rpartial);
            },
            recurValue = apply(slice(1, arguments), recurser);

        while(typeof (recurValue = recurValue(recurser)) === 'function' && recurFn !== identity);

        return recurValue;
    }

    j.apply = apply;
    j.compose = compose;
    j.countArguments = countArguments;
    j.curry = curry;
    j.concat = concat;
    j.either = either;
    j.identity = identity;
    j.maybe = maybe;
    j.partial = partial;
    j.recur = recur;
    j.rpartial = rpartial;
    j.slice = slice;

})(jfp);

(function(j){
    'use strict';
    
    function isBoolean(value){
        return typeof value === 'boolean';
    }
    
    function isObject(value){
        return (typeof value == 'object');
    }
    
    function isArray(value){
        return (isObject(value) && Object.prototype.toString.call(value) === '[object Array]');
    }
    
    function isString(value){
        return typeof value === 'string';
    }
    
    function isNull(value){
        return value === null;
    }
    
    function isNumber(value){
        return typeof value === 'number';
    }
    
    function isNumeric(value){
        var pattern = /^(0x)?[0-9]+((\.[0-9]+)|(e\-?[0-9]+))?$/;
        return isNumber(value) || (isString(value) && !!value.match(pattern));
    }
    
    function isTruthy(value){
        return !!value;
    }
    
    function isUndefined(value){
        return value === undefined;
    }
    
    function not(value){
        return !value;
    }
    
    j.isArray = isArray;
    j.isBoolean = isBoolean;
    j.isNull = isNull;
    j.isNumber = isNumber;
    j.isNumeric = isNumeric;
    j.isObject = isObject;
    j.isString = isString;
    j.isTruthy = isTruthy;
    j.isUndefined = isUndefined;
    j.not = not;
    
})(jfp);

(function(j){
    'use strict';

    function conj(value, dest){
        var destination = j.slice(0, j.either([], dest));

        if(value){
            destination.push(value);
        }

        return destination;
    }

    function cons(value, source){
        var baseArray = (!!value) ? [value] : [];
        return j.concat(baseArray, source);
    }
    
    function each(userFn, userArray){
        var sanitizedArray = j.either([], userArray),
            sanitizedFn = j.either(j.identity, userFn),
            i;

        for(i = 0; i < sanitizedArray.length; i++){
            sanitizedFn(sanitizedArray[i]);
        }
            
        return sanitizedArray;
    }
    
    function map(userFn, userArray){
        var sanitizedFn = j.either(j.identity, userFn),
            finalArray = [];
            
        function mapFn(value){
            finalArray.push(sanitizedFn(value));
        }
            
        each(mapFn, userArray);
            
        return finalArray;
    }

    j.conj = conj;
    j.cons = cons;
    j.each = each;
    j.map = map;

})(jfp);