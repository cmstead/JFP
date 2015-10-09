(function(j){
    'use strict';

    function isUndefined(value){
        return value === undefined;
    }
    
    function not(value){
        return !Boolean(value);
    }
    
    function equal (a, b) {
        var missingValues = isUndefined(a) || isUndefined(b);
        return not(missingValues) && a === b;
    }

    function isType (typeString, value) {
        return j.equal(j.getType(value), typeString);
    }
    
    function isArray(value){
        return isType('object', value) && Object.prototype.toString.call(value) === '[object Array]';
    }
    
    function isNumeric(value){
        var pattern = /^(0x)?[0-9]+((\.[0-9]+)|(e\-?[0-9]+))?$/,
            number = isType('number', value),
            numericString = isType('string', value) && Boolean(value.match(pattern));
            
        return number || numericString;
    }
    
    function isTruthy(value){
        return Boolean(value);
    }
    
    function typeCheckReduction (value, result, typeString){
        return result || isType(typeString, value);
    }
    
    function isPrimitive (value) {
        var primitiveNames = ['number',
                              'string',
                              'boolean',
                              'undefined'];

        return primitiveNames.reduce(typeCheckReduction.bind(null, value), equal(null, value));
    }

    j.equal = equal;
    j.isArray = isArray;
    j.isBoolean = isType.bind(null, 'boolean');
    j.isEmptyString = equal.bind(null, '');
    j.isFunction = isType.bind(null, 'function');
    j.isNull = equal.bind(null, null);
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
