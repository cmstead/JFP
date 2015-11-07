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

    function isTuple (size, list) {
        return isType('array', list) && list.length === size;
    }

    // Equality
    j.equal = equal;
    j.isEmptyString = equal.bind(null, '');
    j.isNull = equal.bind(null, null);

    // Types
    j.isType = isType;
    j.isArray = isType.bind(null, 'array');
    j.isBoolean = isType.bind(null, 'boolean');
    j.isFunction = isType.bind(null, 'function');
    j.isNumber = isType.bind(null, 'number');
    j.isObject = isType.bind(null, 'object');
    j.isString = isType.bind(null, 'string');
    j.isUndefined = isType.bind(null, 'undefined');

    // Tuples
    j.isTuple = isTuple;
    j.isPair = isTuple.bind(null, 2);
    j.isSingle = isTuple.bind(null, 1);
    j.isTriple = isTuple.bind(null, 3);

    //Other predicates
    j.isNumeric = isNumeric;
    j.isPrimitive = isPrimitive;
    j.isTruthy = isTruthy;
    j.not = not;

})(jfp);
