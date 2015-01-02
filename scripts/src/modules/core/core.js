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

    function captureArguments(userFn){
        return userFn.toString()
                     .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
                     .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
                     .split(/,/);
    }

    function countArguments(userFn){
        var params = maybe([], captureArguments, userFn);

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
    function recursor(recurFn){
        var args = j.slice(1, arguments);

        //This is to make the returned function distinct and identifiable.
        return function recursorFn(localRecursor){
            return apply(j.concat([localRecursor], args), recurFn);
        };
    }

    function verifyRecurValue(recurValue){
        return typeof recurValue === 'function' &&
               recurValue.toString().match('recursorFn');
    }

    //Tail optimization with managed recursion is really complicated.
    //Please don't muck with this unless you TRULY understand what is happening.
    function recur(userFn){
        var recursingFn = either(identity, userFn),
            localRecursor = partial(recursor, recursingFn),
            recurValue = apply(j.slice(1, arguments), localRecursor);

        while(verifyRecurValue(recurValue = recurValue(localRecursor)) && recursingFn !== identity);

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