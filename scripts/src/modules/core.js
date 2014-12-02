(function(j){
    'use strict';

    function postpend(result, source){
        source.forEach(function(value){
            result.push(value);
        });

        return result;
    }

    function cons(value, source){
        var baseArray = [];

        if(value !== null && value !== undefined){
            baseArray.push(value);
        }

        return (!!source && source.length) ? postpend(baseArray, source) : baseArray;
    }

    function identity(value){
        return value;
    }

    function maybe(defaultValue, userFn, optionValue){
        return (!!optionValue) ? userFn(optionValue) : defaultValue;
    }

    function either(defaultValue, optionValue){
        return maybe(defaultValue, identity, optionValue);
    }

    j.cons = cons;
    j.either = either;
    j.identity = identity;
    j.maybe = maybe;
})(jfp);