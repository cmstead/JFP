(function(j){
    'use strict';

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

    function cons(value, source){
        var baseArray = (!!value) ? [value] : [];
        return concat(baseArray, source);
    }
    
    function each(userFn, userArray){
        var sanitizedArray = j.either([], userArray),
            sanitizedFn = j.either(j.identity, userFn),
            i;

        for(i = 0; i < sanitizedArray.length; i++){
            sanitizedFn(sanitizedArray[i]);
        }
            
        return sanitizedArray;
    }
    
    function map(userFn, userArray){
        var sanitizedFn = j.either(j.identity, userFn),
            finalArray = [];
            
        function mapFn(value){
            finalArray.push(sanitizedFn(value));
        }
            
        each(mapFn, userArray);
            
        return finalArray;
    }

    j.concat = concat;
    j.cons = cons;
    j.each = each;
    j.map = map;

})(jfp);