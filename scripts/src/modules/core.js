(function(j){
    'use strict';

    function either(defaultValue, optionValue){
        return (!!optionValue) ? optionValue : defaultValue;
    }

    j.either = either;

})(jfp);