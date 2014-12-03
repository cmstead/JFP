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

    j.concat = concat;
    j.cons = cons;

})(jfp);