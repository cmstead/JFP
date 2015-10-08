(function(j){
    'use strict';
    
    function isBoolean(value){
        return typeof value === 'boolean';
    }

    function isFunction(testFn){
        return typeof testFn === 'function';
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

    function isEmptyString(value){
        return isString(value) && value === '';
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
    
    function isType (typeString, value) {
        return typeof value === typeString;
    }
    
    function isUndefined(value){
        return value === undefined;
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
    j.isBoolean = isBoolean;
    j.isEmptyString = isEmptyString;
    j.isFunction = isFunction;
    j.isNull = isNull;
    j.isNumber = isNumber;
    j.isNumeric = isNumeric;
    j.isObject = isObject;
    j.isPrimitive = isPrimitive;
    j.isString = isString;
    j.isType = isType;
    j.isTruthy = isTruthy;
    j.isUndefined = isUndefined;
    j.not = not;

})(jfp);
