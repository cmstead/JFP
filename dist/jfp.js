var jfp = (function(){
    'use strict';
    
    function resolveFunction(functionValue){
        return typeof functionValue === 'string' ? jfp[functionValue] : functionValue;
    }
    
    function curryAlias(){
        var args = jfp.slice(0, arguments);

        args[0] = resolveFunction(args[0]);
        
        return jfp.apply(jfp.curry, args);
    }
    
    function pickAlias(key, value){
        var cleanKey = key.slice(1);
        
        return Boolean(value) ? jfp.pick(cleanKey, value) : jfp.partial(jfp.pick, cleanKey);
    }
    
    function chooseResolver(value){
        var resolveToPick = typeof value === 'string' && value.charAt(0) === ':';
        
        return resolveToPick ? pickAlias : curryAlias;
    }
    
    return function(){
        var args = jfp.slice(0, arguments),
            resolver = chooseResolver(args[0]);
        
        return jfp.apply(resolver, args);
    };
    
})();

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


(function(j){
    'use strict';

    function identity(value){
        return value;
    }

    function slice(begin, valueSet, end){
        var values = j.not(j.isTruthy(valueSet)) ? [] : valueSet;

        return j.not(j.isTruthy(end)) ?
                    Array.prototype.slice.call(values, begin) :
                    Array.prototype.slice.call(values, begin, end);
    }

    function shortCircuit(defaultValue, userFn, testValue){
        return (j.isTruthy(testValue) || testValue === 0) ?
            userFn(testValue) :
            defaultValue;
    }

    function maybe(value){
        var type = arguments[1],
            typeOkay = typeof value === type;

        return typeOkay || (!type && !!value) ? value : null;
    }

    function either(defaultValue, testValue){
        var type = arguments[2];
        return maybe(testValue, type) === null ? defaultValue : testValue;
    }

    function apply(userFn, args){
        return userFn.apply(null, args);
    }

    function when(checkValue, userFn){
        var args = slice(2, arguments);
        return j.isTruthy(checkValue) ? apply(userFn, args) : null;
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

    function reverseArgs(userFn){
        return function(){
            var args = j.slice(0, arguments).reverse();
            return j.apply(userFn, args);
        };
    }

    function countArguments(userFn){
        return either(function(){}, userFn).length;
    }

    function execute(userFn){
        return j.apply(userFn, j.slice(1, arguments));
    }

    j.apply = apply;
    j.concat = concat;
    j.countArguments = countArguments;
    j.either = either;
    j.eitherIf = eitherIf;
    j.eitherWhen = eitherWhen;
    j.execute = execute;
    j.identity = identity;
    j.maybe = maybe;
    j.partial = basePartial('left', basePartial, 'left');
    j.reverseArgs = reverseArgs;
    j.rpartial = basePartial('left', basePartial, 'right');
    j.shortCircuit = shortCircuit;
    j.slice = slice;
    j.when = when;

})(jfp);


(function(j){
    'use strict';

    function toDec(value){
        return (j.isNumeric(value)) ? parseInt(value, 10) : null;
    }

    j.toDec = toDec;

})(jfp);

(function(j){
    'use strict';

    function copyArray(valueSet){
        return j.slice(0, valueSet);
    }

    function makeValueArray(value){
        return j.not(j.isUndefined(value)) ? [value] : [];
    }

    function conj(value, dest){
        return j.concat(copyArray(dest), makeValueArray(value));
    }

    function cons(value, source){
        return j.concat(makeValueArray(value), source);
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

    function nth(index, valueSet){
        return j.either(null, j.either([], valueSet)[index]);
    }

    function rest(values){
        return j.slice(1, values);
    }

    function take(count, values){
        return j.isArray(values) ? j.slice(0, values, count) : null;
    }

    function naturalComparator(a, b){
        var comparison = a < b ? -1 : 1;
        return a === b ? 0 : comparison;
    }

    function sort(optionValue, valueSet){
        var comparator = j.isFunction(optionValue) ? optionValue : naturalComparator,
            finalSet = j.isArray(optionValue) ? j.slice(0, optionValue) : j.slice(0, valueSet);

        return finalSet.sort(comparator);
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

    j.conj = conj;
    j.cons = cons;
    j.copyArray = copyArray;
    j.drop = drop;
    j.dropFirst = j.partial(drop, 0);
    j.dropLast = dropLast;
    j.each = each;
    j.first = first;
    j.init = j.dropLast;
    j.last = last;
    j.lastIndex = lastIndex;
    j.nth = nth;
    j.rest = rest;
    j.sort = sort;
    j.take = take;

})(jfp);


(function(j){
    'use strict';

    function pick(key, valueMap){
        var pickResult = j.either({}, valueMap)[key];
        return j.isUndefined(pickResult) ? null : pickResult;
    }

    function merge(defaultObj, mergeData){
        var finalObj = {},
            key;

        for(key in j.either({}, defaultObj)){
            finalObj[key] = defaultObj[key];
        }

        for(key in j.either({}, mergeData)){
            finalObj[key] = mergeData[key];
        }

        return j.eitherIf(null, finalObj, j.isTruthy(defaultObj));
    }

    j.merge = merge;
    j.pick = pick;

})(jfp);


(function(j){
    'use strict';

    //This is complicated and I don't expect people to grok it on first read.
    function curry(userFn){
        var args = j.slice(1, arguments),
            argumentCount = j.countArguments(userFn),
            appliedFn = (args.length < argumentCount) ? j.apply(j.partial, j.concat([curry, userFn], args)) : null,
            result = (!!userFn && args.length >= argumentCount) ? j.apply(userFn, args) : null;

        return j.either(appliedFn, result);
    }

    //zOMG! TAIL OPTIMIZED RECURSION
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
        var recursingFn = j.either(j.identity, userFn, 'function'),
            localRecursor = j.partial(recursor, recursingFn),
            recurValue = j.apply(localRecursor, j.slice(1, arguments));

        while(verifyRecurValue(recurValue = recurValue(localRecursor)) && recursingFn !== j.identity);

        return recurValue;
    }

    /*
     * toValues converts an object to an array of values
     * This is necessary for reduce to convert objects into
     * processible arrays in an upcoming version.
     */
    function valueReducer (recur, baseObj, finalList, keyList) {
        finalList.push(baseObj[j.first(keyList)]);
        return keyList.length === 1 ? finalList : recur(baseObj, finalList, j.rest(keyList));
    }
    
    function toValues (baseObj) {
        var baseIsValid = typeof baseObj === 'object';
        return !baseIsValid ? null : j.recur(valueReducer, baseObj, [], Object.keys(baseObj));
    }
    
	/*
     * Reduce uses tail-optimized (while-trampolined, fully returning) recursion to resolve reductions.
     * Reducer is a pure function for handling a single reduction step.
     * Reduce manages the setup and recursion execution.
     */
    function reducer(userFn, recur, reduction, collection){
        return collection.length === 0 ?
                    reduction :
                    recur(userFn(reduction, j.first(collection)),
                          j.rest(collection));
    }

    function reduce(userFn, values, initialState){
        var appliedReducer = j.partial(reducer, userFn),
            hasInitialState = typeof initialState !== 'undefined',
            
            initialValue = !hasInitialState ? j.first(values) : initialState,
            remainder = !hasInitialState ? j.rest(values) : values;

        return (!!values && values.length > 0) ? j.recur(appliedReducer, initialValue, remainder) : initialValue;
    }

    //Produces a function that returns f(g(x))
    function compositor(f, g){
        return function(){
            return f(j.apply(g, j.slice(0, arguments)));
        };
    }

    function compose(){
        return reduce(compositor, j.slice(0, arguments), j.identity);
    }

    function pipeline(value){
        return j.apply(compose, j.slice(1, arguments).reverse())(value);
    }

    function partialReverse(){
        return j.apply(j.compose(j.reverseArgs, j.partial),
                       j.slice(0, arguments));
    }

    function clone (originalValue, depth) {
        var depthOkay = j.isUndefined(depth) || j.geq(depth, 0),
            copyOkay = j.isType('object', originalValue);
        
        function copy () {
            var keys = Object.keys(originalValue),
                container = j.isArray(originalValue) ? [] : {};
            
            j.each(function (key) {
                var newDepth = j.isNumber(depth) ? depth - 1 : undefined;
                container[key] = clone(originalValue[key], newDepth);
            }, keys);
            
            return container;
        }
        
        return copyOkay && depthOkay ? copy() : originalValue;
    }

    j.clone = clone;
    j.compose = compose;
    j.curry = curry;
    j.partialReverse = partialReverse;
    j.pipeline = pipeline;
    j.recur = recur;
    j.reduce = reduce;
    j.toValues = toValues;

})(jfp);


(function(j){
	
    var map, filter;
    
    // Adapter function for reduce to allow for simplification of
    // array construction behaviors like map and filter
    function arrayReduceAdapter(reducerFn, userFn, valueList){
        var appliedReducer = j.partial(reducerFn, userFn),
            result = j.reduce(appliedReducer, valueList, []);
        
        return j.either([], result);
    }

    /*
     * Map uses reduce to produce a new, completely reference-decoupled list of values
     * Mapper handles a single update step for the final output array
     */
    function mapper(userFn, finalArray, value){
        finalArray.push(userFn(value));
        return finalArray;
    }

    map = j.partial(arrayReduceAdapter, mapper);

    /*
     * Filter uses reduce to produce a new, completely reference-decoupled list of values
     * Filterer handles a single update step for the final output array
     */
    function filterer(userPredicate, finalArray, value){
        return userPredicate(value) ? j.conj(value, finalArray) : finalArray;
    }

    filter = j.partial(arrayReduceAdapter, filterer);
    
    function compact(valueList){
        return filter(j.isTruthy, valueList);
    }

    function predicateAccumulator(predicate, total, value){
        var sanitizedTotal = j.either(0, total, 'number');
        return predicate(value) ? sanitizedTotal + 1 : sanitizedTotal;
    }

    function numberOf(predicate, valueSet){
        var accumulator = j.partial(predicateAccumulator, predicate);
        return j.reduce(accumulator, j.either([], valueSet), 0);
    }

    function captureUnique(finalList, value){
        return j.last(finalList) === value ? finalList : j.conj(value, finalList);
    }
    
    function unique(valueSet){
        return j.reduce(captureUnique, j.sort(j.slice(0, valueSet)), []);
    }

    function union(set1, set2){
        return j.compose(j.unique, j.concat)(set1, set2);
    }

    function addToHash(finalObject, value){
        finalObject[value] = true;
        return finalObject;
    }

    function buildValueHash(valueList){
        return j.either({}, j.reduce(addToHash, valueList, {}));
    }

    function captureIntersection(valueHash, finalList, value){
        return valueHash[value] ? j.conj(value, finalList) : finalList;
    }
    
    function intersect(set1, set2){
        var setHash = buildValueHash(j.either([], set2));
        return j.reduce(j.partial(captureIntersection, setHash), set1, []); 
    }

    function captureDifference(valueHash, finalList, value){
        return !valueHash[value] ? j.conj(value, finalList) : finalList;
    }
    
    function difference(set1, set2){
        var setHash = buildValueHash(j.either([], set2));
        return j.reduce(j.partial(captureDifference, setHash), set1, []);
    }

    function symmetricDifference(set1, set2){
        var setUnion = union(set1, set2),
            setIntersection = intersect(set1, set2);

        return difference(setUnion, setIntersection);
    }

    function everyReducer (predicate, result, valueList){
        return result && predicate(valueList);
    }

    function every (predicate, valueList){
        var reducer = j.partial(everyReducer, predicate);
        return Boolean(j.reduce(reducer, valueList, true));
    }

    function finder (recur, predicate, valueList) {
        var done = !Boolean(valueList) || valueList.length === 0,
            result = done ? null : j.first(valueList);
        
        return done || predicate(result) ? result : recur(predicate, j.rest(valueList));
    }

    function find (predicate, valueList){
        return j.recur(finder, predicate, valueList);
    }

    function someRecur(recur, predicate, valueList){
        var done = valueList.length === 0,
            result = done ? false : predicate(j.first(valueList));
            
        return result || done ? result : recur(predicate, j.rest(valueList));
    }

    function some(predicate, valueList){
        return Boolean(j.recur(someRecur, predicate, valueList));
    }
    
    function contains(value, valueList){
        return some(j.partial(j.equal, value), valueList);
    }

    function partitioner(predicate, partitions, value){
        var index = predicate(value) ? 0 : 1;

        partitions[index].push(value);

        return partitions;
    }

    function partition(predicate, list){
        var sanitizedPredicate = j.either(j.identity, predicate, 'function');
        
        return j.reduce(j.partial(partitioner, sanitizedPredicate),
                        j.either([], list),
                        [[], []]);
    }

    function multiPartitioner(predicate, partitions, value){
        var partitionPredicate = j.rpartial(predicate, value),
            computedPartitions = j.dropLast(partitions);
        
        return j.concat(computedPartitions, partition(partitionPredicate, j.last(partitions)));
    }
    
    function multiPartition(predicate, predicateArgs, list){
        var sanitizedArgs = j.either([], predicateArgs),
            sanitizedPredicate = j.either(j.identity, predicate),
            sanitizedList = j.either([], list);
            
        return !Boolean(list) ?
                [[], []] :
                j.reduce(j.partial(multiPartitioner, sanitizedPredicate),
                         sanitizedArgs,
                         [sanitizedList]);
    }

    j.contains = contains;
    j.compact = compact;
    j.difference = difference;
    j.every = every;
	j.filter = filter;
    j.find = find;
    j.intersect = intersect;
	j.map = map;
	j.multiPartition = multiPartition;
	j.numberOf = numberOf;
    j.partition = partition;
    j.some = some;
    j.symmetricDifference = symmetricDifference;
    j.union = union;
    j.unique = unique;

})(jfp);

(function (j) {
	'use strict';
	
	//Performs 'and' operation on valueSet
    function ander(a, b){
        return a && b;
    }

    function orer(a, b){
        return a || b;
    }

    function reduceConditions(conditionArgs, operator, initialCondition){
        var args = j.map(Boolean, j.slice(0, conditionArgs));
        return Boolean(j.reduce(operator, args, initialCondition));
    }

    function and(a, b){
        return reduceConditions(arguments, ander, true);
    }

    function or(a, b){
        return reduceConditions(arguments, orer, false);
    }

    function xor(a, b){
        var equivalent = Boolean(a) === Boolean(b);
        return or(a, b) && j.not(equivalent);
    }

	j.and = and;
	j.or = or;
	j.xor = xor;

})(jfp);

(function (j) {
	'use strict';
	
	function dereferencer(dataObject, token){
        var key = j.either('', token).trim();
        return key === '' ? dataObject : j.pick(token, dataObject);
    }

    function internalDeref(key, baseData, defaultValue){
        var sanitizedDefault = defaultValue === undefined ? null : defaultValue,
            keyTokens = key.split('.'),
            result = j.reduce(dereferencer, keyTokens, baseData);
        
        return j.either(sanitizedDefault, result);
    }
    
    function deref(key, baseData, defaultValue){
        // Satisifes backwards-compatibility case where key an data are reversed
        var sanitizedKey = typeof key === 'string' ? key : baseData,
            sanitizedData = typeof baseData === 'object' ? baseData : key;
        
        // Fully sanitize data before executing the dereference function
        sanitizedKey = j.either('', sanitizedKey, 'string');
        sanitizedData = j.either(null, sanitizedData, 'object');
        
        return internalDeref(j.either('', sanitizedKey), sanitizedData, defaultValue);
    }
    
    function plucker (baseObj, finalObj, key){
        finalObj[key] = baseObj[key];
        return finalObj;
    }
    
    function pluckKeys (keys, baseObj){
        var sanitizedObject = j.either({}, baseObj, 'object');
        return j.reduce(j.partial(plucker, sanitizedObject), keys, {});
    }
    
    function pluck (key, baseObj) {
        return pluckKeys([key], baseObj);
    }

	j.deref = deref;
    j.pluck = pluck;
    j.pluckKeys = pluckKeys;

})(jfp);

(function(j){
    'use strict';

//This is a recursive add fn
    function adder(recur, current, valueSet){
        return (valueSet.length === 0) ?
                current :
                recur(current + j.first(valueSet), j.rest(valueSet));
    }
    
    function add(a, b){
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

    function modulo(a, b){
        var _a = j.either(0, a),
            _b = j.either(0, b);

        return (_a > 0) ? mod(_a, _b) : _b * (Math.floor(Math.abs(_a)/_b) + 1) + _a;
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
    j.inc = j.partial(j.add, 1);
    j.max = max;
    j.min = min;
    j.mod = mod;
    j.modulo = modulo;
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

var j = jfp;

if(typeof module !== 'undefined' && !!module.exports){
    module.exports = j;
}


