(function(j){
    'use strict';

    function identity(value){
        return value;
    }

    function slice(begin, valueSet, end){
        var values = j.not(j.isTruthy(valueSet)) ? [] : valueSet;

        return j.not(j.isTruthy(end)) ?
                    Array.prototype.slice.call(values, begin) :
                    Array.prototype.slice.call(values, begin, end);
    }

    function shortCircuit(defaultValue, userFn, testValue){
        return (j.isTruthy(testValue) || testValue === 0) ?
            userFn(testValue) :
            defaultValue;
    }

    function maybe(value, type){
        var typeOkay = typeof value === type;

        return typeOkay || (!type && !!value) ? value : null;
    }

    function either(defaultValue, testValue, type){
        return maybe(testValue, type) === null ? defaultValue : testValue;
    }

    function apply(userFn, args){
        return userFn.apply(null, args);
    }

    function when(checkValue, userFn){
        var args = slice(2, arguments);
        return j.isTruthy(checkValue) ? apply(userFn, args) : null;
    }

    function eitherIf(defaultValue, testValue, predicateValue){
        var safePredicate = j.isUndefined(predicateValue) ? true : predicateValue;

        return j.either(defaultValue, j.when(safePredicate, j.partial(j.identity, testValue)));
    }

    function eitherWhen(defaultValue, predicateValue, userFn){
        var sanitizedFn = eitherIf(j.identity, userFn, j.isFunction(userFn));

        return j.either(defaultValue, j.when(predicateValue, sanitizedFn));
    }

    function concat(original, extension){
        var result = slice(0, either([], original)),
            sanitizedExtension = either([], extension),
            i;

        //This is the most performant way to handle concatenation. Trust me.
        for(i = 0; i < sanitizedExtension.length; i++){
            result.push(sanitizedExtension[i]);
        }

        return result;
    }

    function basePartial(direction, userFn){
        var args = slice(2, arguments);

        return function appliedFunction(){
            var applicationArgs = (direction === 'left') ?
                                    concat(args, slice(0, arguments)) :
                                    concat(slice(0, arguments), args);

            return apply(userFn, applicationArgs);
        };
    }

    function reverseArgs(userFn){
        return function(){
            var args = j.slice(0, arguments).reverse();
            j.apply(userFn, args);
        };
    }

    function captureArguments(userFn){
        return userFn.toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
            .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
            .split(/,/);
    }

    function countArguments(userFn){
        var params = shortCircuit([], captureArguments, userFn);

        params = (params.length === 1 && params[0] === '') ? [] : params;

        return params.length;
    }

    function execute(userFn){
        return j.apply(userFn, j.slice(1, arguments));
    }

    j.apply = apply;
    j.concat = concat;
    j.countArguments = countArguments;
    j.either = either;
    j.eitherIf = eitherIf;
    j.eitherWhen = eitherWhen;
    j.execute = execute;
    j.identity = identity;
    j.maybe = maybe;
    j.partial = basePartial('left', basePartial, 'left');
    j.reverseArgs = reverseArgs;
    j.rpartial = basePartial('left', basePartial, 'right');
    j.shortCircuit = shortCircuit;
    j.slice = slice;
    j.when = when;

})(jfp);
