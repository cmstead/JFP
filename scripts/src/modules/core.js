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
    
    function slice(valueSet, index){
        return Array.prototype.slice.call(valueSet, index);
    }

    //Begin function-relative core code
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
    
    //Todo: pull shared logic out of partials
    function partial(userFn){
        var args = slice(arguments, 1);
        
        return function appliedFn(){
            return userFn.apply(null, concat(args, slice(arguments, 0)));
        };
    }

    function rpartial(userFn){
        var args = slice(arguments, 1);
        
        return function appliedFn(){
            return userFn.apply(null, concat(slice(arguments, 0), args));
        };
    }

    j.apply = apply;
    j.concat = concat;
    j.either = either;
    j.identity = identity;
    j.maybe = maybe;
    j.partial = partial;
    j.rpartial = rpartial;
    j.slice = slice;

})(jfp);