jfp = (function(){
    'use strict';

    return {};

})();

var j = jfp;

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

    function apply(userFn, values){
        return userFn.apply(null, either([], values));
    }

    j.apply = apply;
    j.either = either;
    j.identity = identity;
    j.maybe = maybe;

})(jfp);

(function(j){
    'use strict';
    
    function isBoolean(value){
        return typeof value === 'boolean';
    }
    
    function isObject(value){
        return (typeof value == 'object');
    }
    
    function isArray(value){
        return (isObject(value) && Object.prototype.toString.call(value) === '[object Array]');
    }
    
    function isString(value){
        return typeof value === 'string';
    }
    
    function isNull(value){
        return value === null;
    }
    
    function isNumber(value){
        return typeof value === 'number';
    }
    
    function isNumeric(value){
        var pattern = /^(0x)?[0-9]+((\.[0-9]+)|(e\-?[0-9]+))?$/;
        return isNumber(value) || (isString(value) && !!value.match(pattern));
    }
    
    function isTruthy(value){
        return !!value;
    }
    
    function isUndefined(value){
        return value === undefined;
    }
    
    function not(value){
        return !value;
    }
    
    j.isArray = isArray;
    j.isBoolean = isBoolean;
    j.isNull = isNull;
    j.isNumber = isNumber;
    j.isNumeric = isNumeric;
    j.isObject = isObject;
    j.isString = isString;
    j.isTruthy = isTruthy;
    j.isUndefined = isUndefined;
    j.not = not;
    
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