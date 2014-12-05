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
    
    function partial(userFn){
        var args = Array.prototype.slice.call(arguments, 1);
        return function appliedFn(){
            var newArgs = Array.prototype.slice.call(arguments, 0),
                i = 0;
                
            for(; i < newArgs.length; i++){
                args.push(newArgs[i]);
            }
            
            return userFn.apply(null, args);
        };
    }

    function rpartial(userFn){
        var args = Array.prototype.slice.call(arguments, 1);
        
        return function appliedFn(){
            var newArgs = Array.prototype.slice.call(arguments, 0),
                i = 0;
                
            for(; i < args.length; i++){
                newArgs.push(args[i]);
            }
            
            return userFn.apply(null, newArgs);
        };
    }

    j.apply = apply;
    j.either = either;
    j.identity = identity;
    j.maybe = maybe;
    j.partial = partial;
    j.rpartial = rpartial;

})(jfp);