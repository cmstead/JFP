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
    
    //Performs 'and' operation on valueSet
    function ander(recur, current, valueSet){
        return (valueSet.length === 0) ? 
                current : 
                recur(current && !!j.first(valueSet), j.rest(valueSet));
    }
    
    function and(){
        return j.recur(ander, true, j.slice(0, arguments));
    }
    
    //Performs 'or' operation on valueSet
    function orer(recur, current, valueSet){
        return (valueSet.length === 0) ?
                current :
                recur(current || !!j.first(valueSet), j.rest(valueSet));
    }
    
    function or(){
        return j.recur(orer, false, j.slice(0, arguments));
    }
    
    function xor(a, b){
        return !!(or(a, b) && not(isTruthy(a) === isTruthy(b)));
    }
    
    j.and = and;
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
    j.or = or;
    j.xor = xor;
    
})(jfp);
