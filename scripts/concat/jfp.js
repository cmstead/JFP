jfp = (function(){
    'use strict';

    return {};
})();

(function(j){

    function slice(begin, valueSet, end){
        return (!end) ? Array.prototype.slice.call(valueSet, begin) :
                        Array.prototype.slice.call(valueSet, begin, end);
    }

    function concat(original, extension){
        var result = j.slice(0, j.either([], original)),
            sanitizedExtension = j.either([], extension),
            i;

        //This is the most performant way to perform this concatenation. Trust me.
        for(i = 0; i < sanitizedExtension.length; i++){
            result.push(sanitizedExtension[i]);
        }

        return result;
    }

    j.concat = concat;
    j.slice = slice;

})(jfp);

(function(j){
    'use strict';

    //These array-related functions are critical to core behaviors
    //Begin function-related core code
    function identity(value){
        return value;
    }

    function maybe(defaultValue, userFn, optionValue){
        return (!(optionValue === undefined || optionValue === null || optionValue === '')) ?
                userFn(optionValue) : 
                defaultValue;
    }

    function either(defaultValue, optionValue){
        return maybe(defaultValue, identity, optionValue);
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

    function apply(userFn, values){
        return userFn.apply(null, either([], values));
    }
    
    function partial(userFn){
        var args = j.slice(1, arguments);
        
        return function appliedFn(){
            return apply(userFn, j.concat(args, j.slice(0, arguments)));
        };
    }

    function rpartial(userFn){
        var args = j.slice(1, arguments);
        
        return function appliedFn(){
            return apply(userFn, j.concat(j.slice(0, arguments), args));
        };
    }

    //This is complicated and I don't expect people to grok it on first read.
    function curry(userFn){
        var args = j.slice(1, arguments),
            argumentCount = maybe(0, countArguments, userFn),
            appliedFn = (args.length < argumentCount) ? apply(partial, j.concat([curry, userFn], args)) : null,
            result = (!!userFn && args.length >= argumentCount) ? apply(userFn, args) : null;

        return j.either(appliedFn, result);
    }

    //zOMG! TAIL RECURSION
    function recursor(recurFn){
        var args = j.slice(1, arguments);

        //This is to make the returned function distinct and identifiable.
        return function recursorFn(localRecursor){
            return apply(recurFn, j.concat([localRecursor], args));
        };
    }

    function verifyRecurValue(recurValue){
        return typeof recurValue === 'function' &&
               recurValue.toString().match('recursorFn');
    }

    //Tail optimization with managed recursion is really complicated.
    //Please don't muck with this unless you TRULY understand what is happening.
    function recur(userFn){
        var recursingFn = either(identity, userFn),
            localRecursor = partial(recursor, recursingFn),
            recurValue = apply(localRecursor, j.slice(1, arguments));

        while(verifyRecurValue(recurValue = recurValue(localRecursor)) && recursingFn !== identity);

        return recurValue;
    }

    j.apply = apply;
    j.countArguments = countArguments;
    j.curry = curry;
    j.either = either;
    j.identity = identity;
    j.maybe = maybe;
    j.partial = partial;
    j.recur = recur;
    j.rpartial = rpartial;

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
    
})(jfp);

(function(j){
    'use strict';

    function toValues(valueMap){
        var finalArray = (j.isObject(valueMap)) ? [] : null,
            key;

        if(!!finalArray){
            for(key in valueMap){
                if(valueMap.hasOwnProperty(key) && !!valueMap[key]){
                    finalArray.push(valueMap[key]);
                }
            }
        }

        return finalArray;
    }

    function toDec(value){
        return (j.isNumeric(value)) ? parseInt(value, 10) : null;
    }

    j.toDec = toDec;
    j.toValues = toValues;

})(jfp);

(function(j){
    'use strict';

    function conj(value, dest){
        var destination = j.slice(0, j.either([], dest));

        if(j.compose(j.not, j.isUndefined)(value)){
            destination.push(value);
        }

        return destination;
    }

    function cons(value, source){
        var baseArray = (!!value) ? [value] : [];
        return j.concat(baseArray, source);
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
            if(predicate(value)){
                result.push(value);
            }
        }

        each(filterFn, userArray);

        return result;
    }

    function find(userFn, valueSet){
        var finalValue = null;

        function findFn(value){
            var returnValue = true; //Continue

            if(userFn(value)){
                finalValue = value;
                returnValue = false;
            }

            return returnValue;
        }

        each(findFn, j.either([], valueSet));

        return finalValue;
    }

    function first(values){
        return (!values) ? null : j.either(null, values[0]);
    }

    function last(valueSet){
        return (!!valueSet) ? valueSet[valueSet.length - 1] : null;
    }

    function lastIndex(valueSet){
        return (!!valueSet) ? valueSet.length - 1 : null;
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
        var sanitizedFn = j.either(j.identity, userFn),
            finalArray = [];
            
        function mapFn(value){
            finalArray.push(sanitizedFn(value));
        }
            
        each(mapFn, userArray);
            
        return finalArray;
    }
    
    function nth(index, valueSet){
        var argsFulfilled = j.slice(0, arguments).length >= 2;
        return j.either(null, j.either([], valueSet)[index]);
    }

    function rest(values){
        return j.slice(1, values);
    }

    function reduce(userFn, values){
        function reducer(recur, reduction, collection){
            return (collection.length) ?
                        recur(userFn(reduction, first(collection)), rest(collection)) :
                        reduction;
        }
        
        return (!!values && values.length > 0) ? j.recur(reducer, first(values), rest(values)) : null;
    }

    function take(count, values){
        return (!!values) ? j.slice(0, values, count) : null;
    }

    j.conj = conj;
    j.cons = cons;
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
    j.reduce = reduce;
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
            if(sanitizedValueMap[key]){
                finalOutput[key] = sanitizedValueMap[key];
            }
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
    
    //Produces a function that returns f(g(x))
    function compositor(f, g){
        return function(){
            return f(j.apply(g, j.slice(0, arguments)));
        };
    }
    
    function compose(){
        var args = j.slice(0, arguments);
        return (args.length >= 1) ? j.reduce(compositor, args) : j.identity;
    }
    
    function pipeline(){
        return j.apply(compose, j.slice(0, arguments).reverse());
    }

    j.compose = compose;
    j.pipeline = pipeline;

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

    j.add = add;
    j.divide = divide;
    j.max = max;
    j.min = min;
    j.mod = mod;
    j.multiply = multiply;
    j.range = range;
    j.subtract = subtract;
    j.truncate = truncate;

})(jfp);


(function(j){

    function equal(a, b){
        var isNotUndefined = j.compose(j.not, j.isUndefined);

        return (j.and(isNotUndefined(a),
            isNotUndefined(b))) ? a === b : false;
    }

    function greater(a, b){
        if(j.or(j.isUndefined(a), j.isUndefined(b))){
            throw new TypeError('Inequality comparisons require two values');
        }

        return a > b;
    }

    function geq(a, b){
        return j.or(equal(a, b), greater(a, b));
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
    j.geq = geq;
    j.greater = greater;
    j.leq = j.compose(j.not, greater);
    j.less = j.compose(j.not, geq);

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


