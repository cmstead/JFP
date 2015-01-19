jfp = (function(){
    'use strict';

    return {};
})();

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
    
    function isUndefined(value){
        return value === undefined;
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
    j.isString = isString;
    j.isTruthy = isTruthy;
    j.isUndefined = isUndefined;
    j.not = not;

})(jfp);


(function(j){
    'use strict';

    function identity(value){
        return value;
    }

    function slice(begin, valueSet, end){
        return j.not(j.isTruthy(end)) ?
                    Array.prototype.slice.call(valueSet, begin) :
                    Array.prototype.slice.call(valueSet, begin, end);
    }

    function maybe(defaultValue, userFn, testValue){
        return (j.isTruthy(testValue) || testValue === 0) ?
            userFn(testValue) :
            defaultValue;
    }

    function either(defaultValue, testValue){
        return maybe(defaultValue, identity, testValue);
    }

    function apply(userFn, args){
        return userFn.apply(null, args);
    }

    function when(checkValue, userFn){
        var args = slice(2, arguments);
        return j.isTruthy(checkValue) ? apply(userFn, args) : null;
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

    function captureArguments(userFn){
        return userFn.toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
            .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
            .split(/,/);
    }

    function countArguments(userFn){
        var params = maybe([], captureArguments, userFn);

        params = (params.length === 1 && params[0] === '') ? [] : params;

        return params.length;
    }

    j.apply = apply;
    j.concat = concat;
    j.countArguments = countArguments;
    j.either = either;
    j.identity = identity;
    j.maybe = maybe;
    j.partial = basePartial('left', basePartial, 'left');
    j.rpartial = basePartial('left', basePartial, 'right');
    j.slice = slice;
    j.when = when;

})(jfp);

(function(j){
    'use strict';

    function toValues(valueMap){
        var finalArray = [],
            key;

        j.when(j.isObject(valueMap), function(){
            for(key in valueMap){
                if(valueMap.hasOwnProperty(key) && j.isTruthy(valueMap[key])){
                    finalArray = j.conj(valueMap[key], finalArray);
                }
            }
        });

        return j.either(null, j.when(j.isObject(valueMap), function(){ return finalArray; }));
    }

    function toDec(value){
        return (j.isNumeric(value)) ? parseInt(value, 10) : null;
    }

    j.toDec = toDec;
    j.toValues = toValues;

})(jfp);

(function(j){
    'use strict';

    function copyArray(valueSet){
        return j.slice(0, valueSet);
    }

    function makeValueArray(value){
        return j.isTruthy(value) || value === 0 ? [value] : [];
    }

    function conj(value, dest){
        return j.concat(copyArray(dest), makeValueArray(value));
    }

    function cons(value, source){
        return j.concat(makeValueArray(value), source);
    }
    
    function each(userFn, userArray){
        var sanitizedArray = j.either([], userArray),
            sanitizedFn = j.either(j.identity, userFn),
            i;

        for(i = 0; i < sanitizedArray.length; i++){
            if(sanitizedFn(sanitizedArray[i], i) === false){
                break;
            }
        }
            
        return sanitizedArray;
    }

    function filter(predicate, userArray){
        var result = [];

        function filterFn(value){
            j.when(predicate(value), function(){
                result = conj(value, result);
            });
        }

        each(filterFn, userArray);

        return result;
    }

    function find(predicate, valueSet){
        var finalValue = null;

        function findFn(value){
            return j.not(j.when(predicate(value), function(){
                            finalValue = value;
                            return true;
                         }));
        }

        each(findFn, j.either([], valueSet));

        return finalValue;
    }

    function first(values){
        return j.isArray(values) ? j.either(null, values[0]) : null;
    }

    function lastIndex(values){
        return j.isArray(values) ? values.length - 1 : null;
    }

    function last(values){
        return j.isArray(values) ? values[lastIndex(values)] : null;
    }

    function drop(index, valueSet){
        var finalIndex = lastIndex(valueSet),

            sanitizedIndex = (index === 0 || index === finalIndex) ?
                index : j.either(1, index) - 1,

            firstArray = (sanitizedIndex === 0) ?
                [] : j.slice(0, valueSet, sanitizedIndex),

            secondArray = (sanitizedIndex === finalIndex)?
                [] : j.slice(sanitizedIndex + 1, valueSet);

        return j.concat(firstArray, secondArray);
    }

    function dropLast(valueSet){
        return drop(lastIndex(valueSet), valueSet);
    }
    
    function map(userFn, userArray){
        var finalArray = [];
            
        function mapFn(value){
            finalArray = conj(userFn(value), finalArray);
        }
            
        each(mapFn, userArray);
            
        return finalArray;
    }
    
    function nth(index, valueSet){
        return j.either(null, j.either([], valueSet)[index]);
    }

    function rest(values){
        return j.slice(1, values);
    }

    function take(count, values){
        return j.isArray(values) ? j.slice(0, values, count) : null;
    }

    j.conj = conj;
    j.cons = cons;
    j.copyArray = copyArray;
    j.drop = drop;
    j.dropFirst = j.partial(drop, 0);
    j.dropLast = dropLast;
    j.each = each;
    j.filter = filter;
    j.find = find;
    j.first = first;
    j.init = j.dropLast;
    j.last = last;
    j.lastIndex = lastIndex;
    j.map = map;
    j.nth = nth;
    j.rest = rest;
    j.take = take;

})(jfp);


(function(j){
    'use strict';

    function pick(key, valueMap){
        return j.either(null, j.either({}, valueMap)[key]);
    }

    function pluckKeys(keys, valueMap){
        var finalOutput = {},
            sanitizedKeys = j.either([], keys),
            sanitizedValueMap = j.either({}, valueMap);

        function captureValue(key){
            finalOutput[key] = sanitizedValueMap[key];
        }

        j.each(captureValue, sanitizedKeys);

        return finalOutput;
    }

    function pluck(key, valueMap){
        return pluckKeys([key], valueMap);
    }

    j.pick = pick;
    j.pluck = pluck;
    j.pluckKeys = pluckKeys;

})(jfp);

(function(j){
    'use strict';

    function eitherIf(defaultValue, testValue, predicateValue){
        var safePredicate = j.isUndefined(predicateValue) ? true : predicateValue;

        return j.either(defaultValue, j.when(safePredicate, j.partial(j.identity, testValue)));
    }

    function eitherWhen(defaultValue, predicateValue, userFn){
        var sanitizedFn = eitherIf(j.identity, userFn, j.isFunction(userFn));

        return j.either(defaultValue, j.when(predicateValue, sanitizedFn));
    }

    //This is complicated and I don't expect people to grok it on first read.
    function curry(userFn){
        var args = j.slice(1, arguments),
            argumentCount = j.maybe(0, j.countArguments, userFn),
            appliedFn = (args.length < argumentCount) ? j.apply(j.partial, j.concat([curry, userFn], args)) : null,
            result = (!!userFn && args.length >= argumentCount) ? j.apply(userFn, args) : null;

        return j.either(appliedFn, result);
    }

    //zOMG! TAIL RECURSION
    function recursor(recurFn){
        var args = j.slice(1, arguments);

        //This is to make the returned function distinct and identifiable.
        return function recursorFn(localRecursor){
            return j.apply(recurFn, j.concat([localRecursor], args));
        };
    }

    function verifyRecurValue(recurValue){
        return typeof recurValue === 'function' &&
            recurValue.toString().match('recursorFn');
    }

    //Tail optimization with managed recursion is really complicated.
    //Please don't muck with this unless you TRULY understand what is happening.
    function recur(userFn){
        var recursingFn = j.either(j.identity, userFn),
            localRecursor = j.partial(recursor, recursingFn),
            recurValue = j.apply(localRecursor, j.slice(1, arguments));

        while(verifyRecurValue(recurValue = recurValue(localRecursor)) && recursingFn !== j.identity);

        return recurValue;
    }

    function reduce(userFn, values){
        function reducer(recur, reduction, collection){
            return (collection.length) ?
                recur(userFn(reduction, j.first(collection)), j.rest(collection)) :
                reduction;
        }

        return (!!values && values.length > 0) ? recur(reducer, j.first(values), j.rest(values)) : null;
    }

    //Performs 'and' operation on valueSet
    function ander(recur, current, valueSet){
        return (valueSet.length === 0) ?
            current :
            recur(current && !!j.first(valueSet), j.rest(valueSet));
    }

    function and(){
        return recur(ander, true, j.slice(0, arguments));
    }

    //Performs 'or' operation on valueSet
    function orer(recur, current, valueSet){
        return (valueSet.length === 0) ?
            current :
            recur(current || !!j.first(valueSet), j.rest(valueSet));
    }

    function or(){
        return recur(orer, false, j.slice(0, arguments));
    }

    function xor(a, b){
        return !!(or(a, b) && j.not(j.isTruthy(a) === j.isTruthy(b)));
    }

    //Produces a function that returns f(g(x))
    function compositor(f, g){
        return function(){
            return f(j.apply(g, j.slice(0, arguments)));
        };
    }
    
    function compose(){
        var args = j.slice(0, arguments);
        return (args.length >= 1) ? reduce(compositor, args) : j.identity;
    }
    
    function pipeline(){
        return j.apply(compose, j.slice(0, arguments).reverse());
    }

    function unique(valueSet){
        var values = j.slice(0, valueSet).sort(),
            finalValues = [];

        function operator(value){
            finalValues = j.eitherIf(finalValues,
                                     j.conj(value, finalValues),
                                     j.compose(j.not,
                                               j.partial(j.equal, value),
                                               j.last)(finalValues));
        }

        j.each(operator, values);

        return finalValues;
    }

    j.and = and;
    j.compact = j.partial(j.filter, j.isTruthy);
    j.compose = compose;
    j.curry = curry;
    j.eitherIf = eitherIf;
    j.eitherWhen = eitherWhen;
    j.or = or;
    j.pipeline = pipeline;
    j.recur = recur;
    j.reduce = reduce;
    j.unique = unique;
    j.xor = xor;

})(jfp);


(function(j){
    'use strict';
    
    //This is a recursive add fn
    function adder(recur, current, valueSet){
        return (valueSet.length === 0) ?
                current :
                recur(current + j.first(valueSet), j.rest(valueSet));
    }
    
    function add(){
        return j.recur(adder, 0, j.slice(0, arguments));
    }
    
    //This is a recursive divide fn
    function divider(recur, current, valueSet){
        return (valueSet.length === 0) ?
                current :
                recur(current / j.first(valueSet), j.rest(valueSet));
    }
    
    function divide(){
        var args = j.slice(0, arguments),
            first = args.length ? j.first(args) : 1;
        return j.recur(divider, first, j.rest(args));
    }
    
    //This is a recursive multiply fn
    function multiplier(recur, current, valueSet){
        return (valueSet.length === 0) ?
                current :
                recur(current * j.first(valueSet), j.rest(valueSet));
    }
    
    function multiply(){
        return j.recur(multiplier, 1, j.slice(0, arguments));
    }
    
    //This is a recursive subtraction fn
    function subtractor(recur, current, valueSet){
        return (valueSet.length === 0) ?
                current :
                recur(current - j.first(valueSet), j.rest(valueSet));
    }
    
    function subtract(){
        var args = j.slice(0, arguments),
            first = args.length ? j.first(args) : 0;
        return j.recur(subtractor, first, j.rest(args));
    }

    //This is a recursive constructor function for ranges
    function rangeRecurCheck(m, n, inc){
        return inc > 0 ? (m + inc) < n : (m + inc) > n;
    }

    function rangeBuilder(recur, currentRange, m, n, inc){
        var finalRange = rangeRecurCheck(m - inc, n, inc) ?
                            j.conj(m, currentRange) :
                            currentRange;
        
        return rangeRecurCheck(m, n, inc) ?
                recur(finalRange, m + inc, n, inc) :
                finalRange;
    }
    
    function range(a, b, inc){
        var start = j.isUndefined(b) ? 0 : a,
            end = j.isUndefined(b) ? j.either(0, a) : b,
            increment = (!inc) ? 1 : inc;
            
        return j.recur(rangeBuilder,
                       [],
                       j.either(0, start),
                       j.either(0, end),
                       increment);
    }

    function mod(a, b){
        return j.isUndefined(b) ? j.either(0, a) : a%b;
    }

    function truncate(value){
        return (value > 0) ? Math.floor(value) : Math.floor(value) + 1;
    }
    
    function max(a, b){
        var maxValue = -Number.MAX_VALUE,
            _a = j.isUndefined(a) ? maxValue : a,
            _b = j.isUndefined(b) ? maxValue : b;
            
        maxValue = (_a > maxValue) ? _a : maxValue;
        maxValue = (_b > maxValue) ? _b : maxValue;
        
        return maxValue;
    }
    
    function min(a, b){
        var minValue = Number.MAX_VALUE,
            _a = j.isUndefined(a) ? minValue : a,
            _b = j.isUndefined(b) ? minValue : b;
        
        minValue = (_a < minValue) ? _a : minValue;
        minValue = (_b < minValue) ? _b : minValue;
        
        return minValue;
    }

    function fac(value){
        var factorial = j.compose(j.partial(j.reduce, multiply),
                                  j.partial(range, 1),
                                  j.partial(add, 1));

        return j.either(1, j.when(j.greater(value, 0), factorial, value));
    }

    j.add = add;
    j.divide = divide;
    j.fac = fac;
    j.max = max;
    j.min = min;
    j.mod = mod;
    j.multiply = multiply;
    j.range = range;
    j.subtract = subtract;
    j.truncate = truncate;

})(jfp);


(function(j){

    function throwWhenNotComparable(a, b){
        j.when(j.isUndefined(a) || j.isUndefined(b), function(){
            throw new TypeError('Inequality comparisons require two values');
        });
    }

    function equal(a, b){
        var isNotUndefined = j.compose(j.not, j.isUndefined);
        return (isNotUndefined(a) && isNotUndefined(b)) ? a === b : false;
    }

    function greater(a, b){
        throwWhenNotComparable(a, b);
        return a > b;
    }

    function less(a, b){
        throwWhenNotComparable(a, b);
        return a < b;
    }

    function isEven(value){
        return equal(0, j.mod(value, 2));
    }

    function isPositive(value){
        return greater(value, 0);
    }

    function isZero(value){
        return value === 0;
    }

    function isNegative(value){
        return j.compose(j.not, j.or)(isPositive(value), isZero(value));
    }

    function isInt(value){
        return equal(j.truncate(value), value);
    }

    j.isEven = isEven;
    j.isInt = isInt;
    j.isNegative = isNegative;
    j.isNonNegative = j.compose(j.not, isNegative);
    j.isNonPositive = j.compose(j.not, isPositive);
    j.isNonZero = j.compose(j.not, isZero);
    j.isOdd = j.compose(j.not, isEven);
    j.isPositive = isPositive;
    j.isZero = isZero;

    //Special case predicate naming is intended for these functions
    //There is a general expectation that these not be named with 'is'
    j.equal = equal;
    j.geq = j.compose(j.not, less);
    j.greater = greater;
    j.leq = j.compose(j.not, greater);
    j.less = less;

})(jfp);

//(function(j){

    //function shimMode(){
    //    for(var key in j){
    //        window[key] = j[key];
    //    }
    //}

    //This provides the option to run this library without the j object declared.
    //This WILL dirty up the window object and potentially collide with reused names.
    //This might change the way you code forever.
    //if(!!window){
    //    j.shimMode = shimMode;
    //}

//})(jfp);

var j = jfp;

if(typeof module !== 'undefined' && !!module.exports){
    module.exports = j;
}


