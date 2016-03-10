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
    
    function hasFirst (list) {
        return not(isUndefined(j.either([], list, 'array')[0]));
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
    j.hasFirst = hasFirst;
    j.isNumeric = isNumeric;
    j.isPrimitive = isPrimitive;
    j.isTruthy = isTruthy;
    j.not = not;

})(jfp);


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

    function drop (index, list) {
        var result = j.slice(0, j.either([], list, 'array'));
        
        result.splice(j.either(0, index, 'number'), 1);
        
        return result;
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
        return j.slice(0, j.either(valueSet, optionValue, 'array'))
                .sort(j.either(naturalComparator, optionValue, 'function'));
    }

    j.conj = conj;
    j.cons = cons;
    j.copyArray = copyArray;
    j.drop = drop;
    j.dropFirst = j.partial(drop, 0);
    j.dropLast = dropLast;
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

    function getKeys (obj) {
        return Object.keys(j.either({}, obj, 'object'));
    }

    function mergeValue (dataObj, mergedObj, key) {
        mergedObj[key] = dataObj[key];
        return mergedObj;
    }

    function merge(baseObj, mergeData){
        var finalObj = null;
        
        if (j.maybe(baseObj) !== null) {
            finalObj = getKeys(baseObj).reduce(j.partial(mergeValue, baseObj), {});
            finalObj = getKeys(mergeData).reduce(j.partial(mergeValue, mergeData), finalObj);
        }

        return finalObj;
    }

    j.getKeys = getKeys;
    j.merge = merge;
    j.pick = pick;

})(jfp);


(function (j) {
    'use strict';

    function throwIfNotType(type, value) {
        if (!j.isType(type, value)) {
            throw new TypeError('Expected value of type ' + type + ' but got ' + j.getType(value) + '.');
        }
    }

    function throwIfBadFunctionStr(functionStr) {
        var functionPattern = /^function(\s[^(]+)?\s*\([^)]*\)\s*\{(\s*.*)*\}$/m;
        
        if (functionStr.match(functionPattern) === null) {
            throw new Error('Function.toString must return a function string.');
        }
    }

    function enclose(userFn, environment) {
        var functionStr = userFn.toString();
        
        throwIfNotType('function', userFn);
        throwIfBadFunctionStr(functionStr);

        var enclosingFunction = 'return ' + functionStr + ';',
            enclosingFn = new Function(j.getKeys(environment), enclosingFunction);

        return j.apply(enclosingFn, j.toValues(environment));
    }

    //This is complicated and I don't expect people to grok it on first read.
    function curry(userFn) {
        var args = j.slice(1, arguments),
            done = args.length >= j.countArguments(userFn),
            appliedFn = !done ? j.apply(j.partial, j.concat([curry, userFn], args)) : null,
            result = Boolean(userFn) && done ? j.apply(userFn, args) : null;

        return j.either(appliedFn, result);
    }

    //zOMG! TAIL OPTIMIZED RECURSION
    function RecursionIntermediateValue (args) {
        this.args = args;
    }
    
    RecursionIntermediateValue.prototype = {
        valueOf: function () {
            return this.args;
        }
    };

    function recursionIVFactory () {
        var args = j.slice(0, arguments);
        return new RecursionIntermediateValue(args);
    }

    //Tail optimization with managed recursion is slightly complicated.
    //Please don't muck with this unless you understand what is happening.
    function recur(userFn) {
        var recursingFn = j.either(j.identity, userFn, 'function');
        var callResult = j.apply(recursionIVFactory, j.slice(1, arguments));

        while(callResult instanceof RecursionIntermediateValue) {
            callResult = j.apply(recursingFn, j.cons(recursionIVFactory, callResult.valueOf()));
        }

        return callResult;
    }

    function buildRecursionEnvironment (environment) {
        var baseEnvironment = { j: jfp, jfp: jfp, recur: recursionIVFactory };
        return j.merge(baseEnvironment, j.either({}, environment, 'object'));
    }

    function recursible (userFn, environment){
        var recursibleFn = enclose(userFn, buildRecursionEnvironment(environment));
        
        return function () {
            var callResult = j.apply(recursionIVFactory, j.slice(0, arguments));
            
            while(callResult instanceof RecursionIntermediateValue) {
                callResult = j.apply(recursibleFn, callResult.valueOf());
            }
            
            return callResult;
        };
    }

	/*
     * Reduce uses tail-optimized (while-trampolined, fully returning) recursion to resolve reductions.
     * Reducer is a pure function for handling a single reduction step.
     * Reduce manages the setup and recursion execution.
     */
    function reducer(userFn, recur, reduction, collection) {
        return collection.length === 0 ?
            reduction :
            recur(userFn(reduction, j.first(collection)),
                j.rest(collection));
    }

    function reduce(userFn, values) {
        var hasInitialState = !j.isUndefined(arguments[2]),
            initialValue = !hasInitialState ? j.first(values) : arguments[2],
            remainder = !hasInitialState ? j.rest(values) : values;

        return (Boolean(values) && values.length > 0) ?
            j.recur(j.partial(reducer, userFn), initialValue, remainder) :
            initialValue;
    }

    //Produces a function that returns f(g(x))
    function compositor(f, g) {
        var clean = j.splitPartial(j.either, [j.identity], ['function']);

        return function () {
            return clean(f)(j.apply(clean(g), j.slice(0, arguments)));
        };
    }

    function compose() {
        return reduce(compositor, j.slice(0, arguments), j.identity);
    }

    function pipeline(value) {
        return j.apply(compose, j.slice(1, arguments).reverse())(value);
    }

    function partialReverse() {
        return j.apply(j.compose(j.reverseArgs, j.partial),
            j.slice(0, arguments));
    }

    function clone(originalValue, depth) {
        var depthOkay = j.isUndefined(depth) || j.geq(depth, 0),
            copyOkay = j.isType('object', originalValue) || j.isType('array', originalValue);

        function copy() {
            var keys = Object.keys(originalValue),
                container = j.isArray(originalValue) ? [] : {};

            j.each(function (key) {
                var newDepth = j.isNumber(depth) ? depth - 1 : undefined;

                try {
                    container[key] = clone(originalValue[key], newDepth);
                } catch (err) {
                    throw new RangeError('Object contains circular reference or is too deep to clone.');
                }

            }, keys);

            return container;
        }

        return copyOkay && depthOkay ? copy() : originalValue;
    }

    function maybeType(typeString) {
        return j.curry(function (value) {
            return j.maybe(value, typeString);
        }).apply(j, j.slice(1, arguments));
    }

    function eitherType(typeString) {
        return j.curry(function (defaultValue, optionValue) {
            return j.either(defaultValue, optionValue, typeString);
        }).apply(j, j.slice(1, arguments));
    }

    function timesRecursor(recur, count, userFn, accumulator) {
        return j.isZero(count) ? accumulator : recur(count - 1, userFn, userFn(accumulator));
    }

    function times(count, userFn) {
        var accumulator = arguments[2];
        return j.recur(timesRecursor, count, userFn, accumulator);
    }

    function repeatStepFactory(value) {
        return function (accumulator) {
            return accumulator + value;
        };
    }

    function repeat(count, value) {
        return times(count, repeatStepFactory(value), '');
    }


    j.clone = clone;
    j.compose = compose;
    j.curry = curry;
    j.eitherType = eitherType;
    j.enclose = enclose;
    j.maybeType = maybeType;
    j.partialReverse = partialReverse;
    j.pipeline = pipeline;
    j.rcompose = j.reverseArgs(compose);
    j.recur = recur;
    j.recursible = recursible;
    j.reduce = reduce;
    j.repeat = repeat;
    j.times = times;

})(jfp);


(function(j){
	
    /*
     * Map uses reduce to produce a new, completely reference-decoupled list of values
     * Mapper handles a single update step for the final output array
     */
    function mapper(userFn, finalArray, value){
        finalArray.push(userFn(value));
        return finalArray;
    }

    function map (userFn, values) {
        var mapperFn = j.partial(mapper, userFn);
        return j.reduce(mapperFn, values, []);
    }
    
    /*
     * Filter uses reduce to produce a new, completely reference-decoupled list of values
     * Filterer handles a single update step for the final output array
     */
    function filterer(userPredicate, finalArray, value){
        return userPredicate(value) ? j.conj(value, finalArray) : finalArray;
    }

    function filter (predicate, values) {
        var filterFn = j.partial(filterer, predicate);
        return j.reduce(filterFn, values, []);
    }
    
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

    function eachFn(recur, userFn, userArray, index){
        var continuing = j.hasFirst(userArray) && userFn(j.first(userArray), index) !== false;
        return continuing ? recur(userFn, j.rest(userArray), j.inc(index)) : false;
    }
    
    function each (userFn, userArray) {
        var sanitizedFn = j.either(j.identity, userFn),
            sanitizedArray = j.either([], userArray);
        
        j.recur(eachFn, sanitizedFn, sanitizedArray, 0);
        return sanitizedArray;
    }

    function takeEltsUntil (recur, predicate, list, aggregate) {
        var elt = j.first(list);
        return predicate(elt, aggregate) || j.equal(0, list.length) ? aggregate : recur(predicate, j.rest(list), j.conj(elt, aggregate));
    }

    function takeUntil (predicate, list) {
        return j.recur(takeEltsUntil, predicate, list, []);
    }

    function dropEltsUntil (recur, predicate, list){
        return predicate(j.first(list), list) || j.equal(0, list.length) ? list : recur(predicate, j.rest(list));
    }

    function dropUntil (predicate, list){
        return j.recur(dropEltsUntil, predicate, list);
    }

    function zipStep (aggregate, list){
        return [j.conj(j.first(list), aggregate[0]),
                j.conj(j.rest(list), aggregate[1])];
    }

    function zipElts (recur, aggregate, lists){
        var reduction = j.reduce(zipStep, lists, [[], []]);
        return j.equal(0, lists[0].length) ? aggregate : recur(j.conj(reduction[0], aggregate), reduction[1]);
    }

    function zip (lista, listb){
        var lists = j.slice(0, arguments);
        return j.equal(0, lists.length) ? [] : j.recur(zipElts, [], lists);
    }    
    
    j.contains = contains;
    j.compact = compact;
    j.difference = difference;
    j.dropUntil = dropUntil;
    j.each = each;
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
    j.takeUntil = takeUntil;
    j.union = union;
    j.unique = unique;
    j.zip = zip;

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

    function reduceConditions(conditionArgs, operator, initialCondition) {
        return j.pipeline(conditionArgs,
                          j.partial(j.slice, 0),
                          j.partial(j.map, Boolean),
                          j.splitPartial(j.reduce, [operator], [initialCondition]),
                          Boolean);
    }

    function and(a, b){
        return reduceConditions(arguments, ander, true);
    }

    function or(a, b){
        return reduceConditions(arguments, orer, false);
    }

    function xor(a, b){
        var equivalent = Boolean(a) === Boolean(b);
        return or(a, b) && !equivalent;
    }
    
    function composePredicate (predicateFn) {
        var predicateList = j.slice(0, arguments),
            combinator = j.last(predicateList),
            lastIsCombinator = combinator === or || combinator === and;
        
        predicateList = lastIsCombinator ? j.dropLast(predicateList) : predicateList;
        combinator = combinator === or ? or : and;
        
        return function (value) {
            var executor = j.rpartial(j.execute, value);
            
            return j.pipeline(predicateList,
                              j.partial(j.map, executor),
                              j.partial(j.reduce, combinator),
                              Boolean);
        };
    }
    
    // Predicate combinators
	j.and = and;
	j.or = or;
	j.xor = xor;

    j.composePredicate = composePredicate;
    
})(jfp);

(function (j) {
	'use strict';
	
    /*
     * toValues converts an object to an array of values
     * This is necessary for reduce to convert objects into
     * processible arrays in an upcoming version.
     */
	function keyReduction (baseObj, finalList, key) {
		return j.conj(baseObj[key], finalList);
	}
	
	function toValues (baseObj) {
		var reducer = j.partial(keyReduction, baseObj);
		return j.isNull(j.maybe(baseObj, 'object')) ? null : j.reduce(reducer, Object.keys(baseObj), []);
	}

	function dereferencer(dataObject, token){
        var key = j.either('', token).trim();
        return key === '' ? dataObject : j.pick(token, dataObject);
    }

    function internalDeref(key, baseData, defaultValue){
        var sanitizedDefault = j.isUndefined(defaultValue) ? null : defaultValue,
            keyTokens = key.split('.'),
            result = j.reduce(dereferencer, keyTokens, baseData);
        
        return j.either(sanitizedDefault, result);
    }
    
    function deref(key, baseData){
        // Satisifes backwards-compatibility case where key an data are reversed
        var defaultValue = arguments[2],
            sanitizedKey = typeof key === 'string' ? key : baseData,
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

    function transformer (obj, result, transformation) {
        result[transformation[1]] = deref(transformation[0], obj);
        return result;
    }

    function transform (transformation, obj) {
        return j.pipeline(transformation,
                          j.partial(j.filter, j.isPair),
                          j.splitPartial(j.reduce, [j.partial(transformer, obj)], [{}]));
    }

	j.deref = deref;
    j.pluck = pluck;
    j.pluckKeys = pluckKeys;
    j.toValues = toValues;
    j.transform = transform;

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
    
    function divide(a, b){
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
    
    function multiply(a, b){
        return j.recur(multiplier, 1, j.slice(0, arguments));
    }
    
    //This is a recursive subtraction fn
    function subtractor(recur, current, valueSet){
        return (valueSet.length === 0) ?
                current :
                recur(current - j.first(valueSet), j.rest(valueSet));
    }
    
    function subtract(a, b){
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

    function greater(a, b){
        throwWhenNotComparable(a, b);
        return a > b;
    }

    function less(a, b){
        throwWhenNotComparable(a, b);
        return a < b;
    }

    function isInt(value){
        return j.equal(j.truncate(value), value);
    }

    function isMultipleOf (base, test) {
        return j.equal(0, j.mod(test, base));
    }

    function isEven (value) {
        return isZero(j.mod(value, 2));
    }

    function between (bounds, value){
        var sortedBounds = j.sort(j.take(2, bounds)),
            lowerBound = j.first(sortedBounds),
            upperBound = j.last(sortedBounds);
        return j.less(lowerBound, value) && j.greater(upperBound, value);
    }

    var isNegative = j.partial(greater, 0),
        isPositive = j.partial(less, 0),
        isZero = j.partial(j.equal, 0);

    j.between = between;
    j.isEven = isEven;
    j.isInt = isInt;
    j.isMultipleOf = isMultipleOf;
    j.isNegative = isNegative;
    j.isNonNegative = j.compose(j.not, isNegative);
    j.isNonPositive = j.compose(j.not, isPositive);
    j.isNonZero = j.compose(j.not, isZero);
    j.isOdd = j.compose(j.not, isEven);
    j.isPositive = isPositive;
    j.isZero = isZero;

    //Special case predicate naming is intended for these functions
    //There is a general expectation that these not be named with 'is'
    j.geq = j.compose(j.not, less);
    j.greater = greater;
    j.leq = j.compose(j.not, greater);
    j.less = less;

})(jfp);

(function (j) {
	'use strict';
	
	function attachFunction (module, j, key) {
		if(j.isUndefined(j[key]) && j.isType('function', module[key])) {
			j[key] = module[key];
		}
		return j;
	}
	
	function addModule (provider) {
		var module = j.either(j.always({}), provider, 'function')(),
			moduleKeys = j.getKeys(module);
			
		return function () {
			return j.reduce(j.partial(attachFunction, module), moduleKeys, j);
		};
	}
	
	j.addModule = addModule;
	
})(jfp);

var j = jfp;

if(typeof module !== 'undefined' && Boolean(module.exports)){
    // Node and CommonJS export
    module.exports = j;
} else if (typeof define === 'function' && Boolean(define.amd)) {
    // AMD and Require.js module definition
    define([], function () {
        return jfp;
    });
}


