jfp = (function(){
    'use strict';

    return {};

})();

j = jfp;

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