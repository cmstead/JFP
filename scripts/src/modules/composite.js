(function(j){
    'use strict';

    function eitherIf(defaultValue, testValue, predicateValue){
        var safePredicate = j.isUndefined(predicateValue) ? true : predicateValue;

        return j.either(defaultValue, j.when(safePredicate, j.partial(j.identity, testValue)));
    }

    function eitherWhen(defaultValue, predicateValue, userFn){
        var sanitizedFn = eitherIf(j.identity, userFn, j.isFunction(userFn));

        return j.either(defaultValue, j.when(predicateValue, sanitizedFn));
    }

    //This is complicated and I don't expect people to grok it on first read.
    function curry(userFn){
        var args = j.slice(1, arguments),
            argumentCount = j.maybe(0, j.countArguments, userFn),
            appliedFn = (args.length < argumentCount) ? j.apply(j.partial, j.concat([curry, userFn], args)) : null,
            result = (!!userFn && args.length >= argumentCount) ? j.apply(userFn, args) : null;

        return j.either(appliedFn, result);
    }

    //zOMG! TAIL RECURSION
    function recursor(recurFn){
        var args = j.slice(1, arguments);

        //This is to make the returned function distinct and identifiable.
        return function recursorFn(localRecursor){
            return j.apply(recurFn, j.concat([localRecursor], args));
        };
    }

    function verifyRecurValue(recurValue){
        return typeof recurValue === 'function' &&
            recurValue.toString().match('recursorFn');
    }

    //Tail optimization with managed recursion is really complicated.
    //Please don't muck with this unless you TRULY understand what is happening.
    function recur(userFn){
        var recursingFn = j.either(j.identity, userFn),
            localRecursor = j.partial(recursor, recursingFn),
            recurValue = j.apply(localRecursor, j.slice(1, arguments));

        while(verifyRecurValue(recurValue = recurValue(localRecursor)) && recursingFn !== j.identity);

        return recurValue;
    }

    function reduce(userFn, values){
        function reducer(recur, reduction, collection){
            return (collection.length) ?
                recur(userFn(reduction, j.first(collection)), j.rest(collection)) :
                reduction;
        }

        return (!!values && values.length > 0) ? recur(reducer, j.first(values), j.rest(values)) : null;
    }

    //Performs 'and' operation on valueSet
    function ander(recur, current, valueSet){
        return (valueSet.length === 0) ?
            current :
            recur(current && !!j.first(valueSet), j.rest(valueSet));
    }

    function and(){
        return recur(ander, true, j.slice(0, arguments));
    }

    //Performs 'or' operation on valueSet
    function orer(recur, current, valueSet){
        return (valueSet.length === 0) ?
            current :
            recur(current || !!j.first(valueSet), j.rest(valueSet));
    }

    function or(){
        return recur(orer, false, j.slice(0, arguments));
    }

    function xor(a, b){
        return !!(or(a, b) && j.not(j.isTruthy(a) === j.isTruthy(b)));
    }

    //Produces a function that returns f(g(x))
    function compositor(f, g){
        return function(){
            return f(j.apply(g, j.slice(0, arguments)));
        };
    }
    
    function compose(){
        var args = j.slice(0, arguments);
        return (args.length >= 1) ? reduce(compositor, args) : j.identity;
    }
    
    function pipeline(){
        return j.apply(compose, j.slice(0, arguments).reverse());
    }

    function unique(valueSet){
        var values = j.slice(0, valueSet).sort(),
            finalValues = [];

        function operator(value){
            finalValues = j.eitherIf(finalValues,
                                     j.conj(value, finalValues),
                                     j.compose(j.not,
                                               j.partial(j.equal, value),
                                               j.last)(finalValues));
        }

        j.each(operator, values);

        return finalValues;
    }

    j.and = and;
    j.compact = j.partial(j.filter, j.isTruthy);
    j.compose = compose;
    j.curry = curry;
    j.eitherIf = eitherIf;
    j.eitherWhen = eitherWhen;
    j.or = or;
    j.pipeline = pipeline;
    j.recur = recur;
    j.reduce = reduce;
    j.unique = unique;
    j.xor = xor;

})(jfp);
