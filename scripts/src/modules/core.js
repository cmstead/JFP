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
    
    function slice(begin, valueSet, end){
        return (!end) ? Array.prototype.slice.call(valueSet, begin) :
                        Array.prototype.slice.call(valueSet, begin, end);
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
            appliedFn = (args.length < argumentCount) ? apply(concat([curry, userFn], args), partial) : null,
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