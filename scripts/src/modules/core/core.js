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

    function applyCurry(userFn, args){
        return apply(j.concat([userFn], j.slice(0, args)), curry);
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
    j.applyCurry = applyCurry;
    j.either = either;
    j.identity = identity;
    j.maybe = maybe;
    j.partial = partial;
    j.recur = recur;
    j.rpartial = rpartial;

})(jfp);