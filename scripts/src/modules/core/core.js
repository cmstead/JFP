(function(j){
    'use strict';

    function identity(value){
        return value;
    }

    function getType (value) {
        var valueType = typeof value,
            isArray = valueType === 'object' && Object.prototype.toString.call(value) === '[object Array]';
            
        return isArray ? 'array' : valueType;
    }

    function empty (typeString) {
        return {
                array: [],
                boolean: false,
                'null': null,
                number: 0,
                object: {},
                string: ''
            }[typeString];
    }

    function maybe(value){
        var type = arguments[1],
            valueType = getType(value),
            typeOkay = valueType === type || valueType === 'array' && type === 'object';
        
        return typeOkay || (!type && Boolean(value)) ? value : null;
    }

    function either(defaultValue, testValue){
        var type = arguments[2];
        return maybe(testValue, type) === null ? defaultValue : testValue;
    }
    
    function slice (begin, valueSet) {
        var boundaries = !arguments[2] ? [begin] : [begin, arguments[2]];
        return Array.prototype.slice.apply(either([], valueSet), boundaries);
    }

    function always (value) {
        var output = getType(value) === 'undefined' ? null : value;
        return identity.bind(null, output);
    }

    function shortCircuit(defaultValue, fn, optionValue){
        var type = optionValue === 0 ? 'number' : arguments[3];
        return maybe(optionValue, type) !== null ? fn(optionValue) : defaultValue;
    }

    function apply(userFn, args){
        return userFn.apply(null, args);
    }

    function when(checkValue, userFn){
        return j.isTruthy(checkValue) ? apply(userFn, slice(2, arguments)) : null;
    }

    function eitherIf(defaultValue, testValue, predicateValue){
        var safePredicate = j.isUndefined(predicateValue) ? true : predicateValue;

        return j.either(defaultValue, j.when(safePredicate, j.partial(j.identity, testValue)));
    }

    function eitherWhen(defaultValue, predicateValue, userFn){
        var sanitizedFn = eitherIf(j.identity, userFn, j.isFunction(userFn));

        return j.either(defaultValue, j.when(predicateValue, sanitizedFn));
    }

    function concat(original, extension){
        var result = slice(0, either([], original)),
            sanitizedExtension = either([], extension),
            i;

        //This is the most performant way to handle concatenation. Trust me.
        for(i = 0; i < sanitizedExtension.length; i++){
            result.push(sanitizedExtension[i]);
        }

        return result;
    }

    function basePartial(direction, userFn){
        var args = slice(2, arguments);

        return function appliedFunction(){
            var applicationArgs = (direction === 'left') ?
                                    concat(args, slice(0, arguments)) :
                                    concat(slice(0, arguments), args);

            return apply(userFn, applicationArgs);
        };
    }

    function splitPartial (baseFn, left, right) {
        var leftApplied = apply(basePartial, concat(['left', baseFn], left));
        return apply(basePartial, concat(['right', leftApplied], right));
    }

    function reverseArgs(userFn){
        return function(){
            return j.apply(userFn, j.slice(0, arguments).reverse());
        };
    }

    function countArguments(userFn){
        return either(function(){}, userFn).length;
    }

    function execute(userFn){
        return j.apply(userFn, j.slice(1, arguments));
    }
    
    j.always = always;
    j.apply = apply;
    j.concat = concat;
    j.countArguments = countArguments;
    j.either = either;
    j.eitherIf = eitherIf;
    j.eitherWhen = eitherWhen;
    j.empty = empty;
    j.execute = execute;
    j.getType = getType;
    j.identity = identity;
    j.maybe = maybe;
    j.partial = basePartial('left', basePartial, 'left');
    j.reverseArgs = reverseArgs;
    j.rpartial = basePartial('left', basePartial, 'right');
    j.shortCircuit = shortCircuit;
    j.slice = slice;
    j.splitPartial = splitPartial;
    j.when = when;

})(jfp);
