jfp = (function(){
    'use strict';

    return {};

})();

(function(j){

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
    
    function slice(begin, valueSet, end){
        return (!end) ? Array.prototype.slice.call(valueSet, begin) :
                        Array.prototype.slice.call(valueSet, begin, end);
    }

    j.concat = concat;
    j.slice = slice;

})(jfp);

(function(j){
    'use strict';

    //These array-related functions are critical to core behaviors
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
        var args = j.slice(1, arguments);
        
        return function appliedFn(){
            return apply(j.concat(args, j.slice(0, arguments)), userFn);
        };
    }

    function rpartial(userFn){
        var args = j.slice(1, arguments);
        
        return function appliedFn(){
            return apply(j.concat(j.slice(0, arguments), args), userFn);
        };
    }

    //This is complicated and I don't expect people to grok it on first read.
    function curry(userFn){
        var args = j.slice(1, arguments),
            argumentCount = maybe(0, countArguments, userFn),
            appliedFn = (args.length < argumentCount) ? apply(j.concat([curry, userFn], args), partial) : null,
            result = (!!userFn && args.length >= argumentCount) ? apply(args, userFn) : null;

        return j.either(appliedFn, result);
    }

    //zOMG! TAIL RECURSION
    function verifyRecurValue(recurValue){
        var isRecursor = typeof recurValue === 'function';
        return (isRecursor && recurValue.toString().match('recursorFn'));
    }

    function recur(userFn){
        var recurFn = either(identity, userFn),
            recursor = function recursor(){
                var args = j.slice(0, arguments);
                
                //This is to make the returned function distinct and identifiable.
                return function recursorFn(){
                    return apply(j.slice(0, arguments), 
                                 apply(j.concat([recurFn], args), rpartial));
                };
            },
            recurValue = apply(j.slice(1, arguments), recursor);
        
        while(verifyRecurValue(recurValue = recurValue(recursor)) && recurFn !== identity);

        return recurValue;
    }

    j.apply = apply;
    j.countArguments = countArguments;
    j.curry = curry;
    j.either = either;
    j.identity = identity;
    j.maybe = maybe;
    j.partial = partial;
    j.recur = recur;
    j.rpartial = rpartial;

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
            if(sanitizedFn(sanitizedArray[i], i) === false){
                break;
            }
        }
            
        return sanitizedArray;
    }

    function filter(predicate, userArray){
        var result = [];

        function filterFn(value){
            if(predicate(value)){
                result.push(value);
            }
        }

        each(filterFn, userArray);

        return result;
    }

    function find(userFn, valueSet){
        var finalValue = null;

        function findFn(value){
            var returnValue = true; //Continue

            if(userFn(value)){
                finalValue = value;
                returnValue = false;
            }

            return returnValue;
        }

        each(findFn, j.either([], valueSet));

        return finalValue;
    }

    function first(values){
        return (!values) ? null : j.either(null, values[0]);
    }

    function last(valueSet){
        return (!!valueSet) ? valueSet[valueSet.length - 1] : null;
    }

    function lastIndex(valueSet){
        return (!!valueSet) ? valueSet.length - 1 : null;
    }

    function drop(index, valueSet){
        var finalIndex = lastIndex(valueSet),

            sanitizedIndex = (index === 0 || index === finalIndex) ?
                index : j.either(1, index) - 1,

            firstArray = (sanitizedIndex === 0) ?
                [] : j.slice(0, valueSet, sanitizedIndex),

            secondArray = (sanitizedIndex === finalIndex)?
                [] : j.slice(sanitizedIndex + 1, valueSet);

        return j.concat(firstArray, secondArray);
    }

    function dropLast(valueSet){
        return drop(lastIndex(valueSet), valueSet);
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
    
    function nth(index, valueSet){
        var argsFulfilled = j.slice(0, arguments).length >= 2;
        return j.either(null, j.either([], valueSet)[index]);
    }

    function rest(values){
        return j.slice(1, values);
    }

    function reduce(userFn, values){
        function reducer(recur, reduction, collection){
            return (collection.length) ?
                        recur(userFn(reduction, first(collection)), rest(collection)) :
                        reduction;
        }
        
        return (!!values && values.length > 0) ? j.recur(reducer, first(values), rest(values)) : null;
    }

    function take(count, values){
        return (!!values) ? j.slice(0, values, count) : null;
    }

    j.conj = conj;
    j.cons = cons;
    j.drop = drop;
    j.dropFirst = j.partial(drop, 0);
    j.dropLast = dropLast;
    j.each = each;
    j.filter = filter;
    j.find = find;
    j.first = first;
    j.last = last;
    j.lastIndex = lastIndex;
    j.map = map;
    j.nth = nth;
    j.reduce = reduce;
    j.rest = rest;
    j.take = take;

})(jfp);

(function(j){
    'use strict';
    
    //Produces a function that returns f(g(x))
    function compositor(f, g){
        return function(){
            return f(j.apply(j.slice(0, arguments), g));
        };
    }
    
    function compose(){
        var args = j.slice(0, arguments);
        return (args.length >= 1) ? j.reduce(compositor, args) : j.identity;
    }

    j.compose = compose;

})(jfp);

(function(j, window){

    function shimMode(){
        for(var key in j){
            window[key] = j[key];
        }
    }

    //This provides the option to run this library without the j object declared.
    //This WILL dirty up the window object and potentially collide with reused names.
    //This might change the way you code forever.
    if(typeof window !== 'undefined'){
        j.shimMode = shimMode;
    }

    if(typeof module !== 'undefined'){
        module.exports = j;
    }

})(jfp, window);

var j = jfp;