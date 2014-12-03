(function(j){
    'use strict';

    function identity(value){
        return value;
    }

    function maybe(defaultValue, userFn, optionValue){
        return (!!optionValue) ? userFn(optionValue) : defaultValue;
    }

    function either(defaultValue, optionValue){
        return maybe(defaultValue, identity, optionValue);
    }

    j.either = either;
    j.identity = identity;
    j.maybe = maybe;

})(jfp);