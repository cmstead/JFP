(function(j){
    'use strict';

    function identity(value){
        return value;
    }

    function slice(begin, valueSet, end){
        return j.not(j.isTruthy(end)) ?
                    Array.prototype.slice.call(valueSet, begin) :
                    Array.prototype.slice.call(valueSet, begin, end);
    }

    function maybe(defaultValue, userFn, testValue){
        return (j.not(j.isUndefined(testValue) || j.isNull(testValue) || j.isEmptyString(testValue))) ?
            userFn(testValue) :
            defaultValue;
    }

    function either(defaultValue, testValue){
        return maybe(defaultValue, identity, testValue);
    }

    function apply(userFn, args){
        return userFn.apply(null, args);
    }

    function when(checkValue, userFn){
        var args = slice(2, arguments);
        return j.isTruthy(checkValue) ? apply(userFn, args) : null;
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

    j.apply = apply;
    j.concat = concat;
    j.countArguments = countArguments;
    j.either = either;
    j.identity = identity;
    j.maybe = maybe;
    j.partial = basePartial('left', basePartial, 'left');
    j.rpartial = basePartial('left', basePartial, 'right');
    j.slice = slice;
    j.when = when;

})(jfp);