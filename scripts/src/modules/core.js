(function(j){
    'use strict';

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

    function apply(userFn, values){
        return userFn.apply(null, either([], values));
    }

    j.apply = apply;
    j.either = either;
    j.identity = identity;
    j.maybe = maybe;

})(jfp);