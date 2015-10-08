(function(j){
    'use strict';
    
    function isType (typeString, value) {
        return typeof value === typeString;
    }
    
    function isArray(value){
        return isType('object', value) && Object.prototype.toString.call(value) === '[object Array]';
    }
    
    function isEmptyString(value){
        return value === '';
    }
    
    function isNull(value){
        return value === null;
    }
    
    function isUndefined(value){
        return value === undefined;
    }
    
    function isNumeric(value){
        var pattern = /^(0x)?[0-9]+((\.[0-9]+)|(e\-?[0-9]+))?$/;
        return isType('number', value) || (isType('string', value) && !!value.match(pattern));
    }
    
    function isTruthy(value){
        return Boolean(value);
    }
    
    function typeCheckReduction (value, result, typeString){
        return result || isType(typeString, value);
    }
    
    function isPrimitive (value) {
        var nullValue = isNull(value),
            primitiveNames = ['number',
                              'string',
                              'boolean',
                              'undefined'];

        return primitiveNames.reduce(typeCheckReduction.bind(null, value), nullValue);
    }

    function not(value){
        return !value;
    }

    j.isArray = isArray;
    j.isBoolean = isType.bind(null, 'boolean');
    j.isEmptyString = isEmptyString;
    j.isFunction = isType.bind(null, 'function');
    j.isNull = isNull;
    j.isNumber = isType.bind(null, 'number');
    j.isNumeric = isNumeric;
    j.isObject = isType.bind(null, 'object');
    j.isPrimitive = isPrimitive;
    j.isString = isType.bind(null, 'string');
    j.isType = isType;
    j.isTruthy = isTruthy;
    j.isUndefined = isType.bind(null, 'undefined');
    j.not = not;

})(jfp);
