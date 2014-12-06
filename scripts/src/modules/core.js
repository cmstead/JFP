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
    
    function slice(index, valueSet){
        return Array.prototype.slice.call(valueSet, index);
    }

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

    function apply(values, userFn){
        return userFn.apply(null, either([], values));
    }
    
    function partial(userFn){
        var args = slice(1, arguments);
        
        return function appliedFn(){
            return apply(concat(args, slice(0, arguments)), userFn);
        };
    }

    function rpartial(userFn){
        var args = slice(1, arguments);
        
        return function appliedFn(){
            return apply(concat(slice(0, arguments), args), userFn);
        };
    }

    function compose(userFn){
        var userFns = slice(0, arguments);

        return function(){
            var args = slice(0, arguments),
                result = either([], args),
                userFn;

            while(!!(userFn = userFns.pop())){
                result = [apply(result, userFn)];
            }

            return either([], result)[0];
        };
    }

    j.apply = apply;
    j.compose = compose;
    j.concat = concat;
    j.either = either;
    j.identity = identity;
    j.maybe = maybe;
    j.partial = partial;
    j.rpartial = rpartial;
    j.slice = slice;

})(jfp);