(function(j){
    'use strict';

    var map, filter;

    //This is complicated and I don't expect people to grok it on first read.
    function curry(userFn){
        var args = j.slice(1, arguments),
            argumentCount = j.countArguments(userFn),
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


    /*
     * Reduce uses tail-optimized (while-trampolined, fully returning) recursion to resolve reductions.
     * Reducer is a pure function for handling a single reduction step.
     * Reduce manages the setup and recursion execution.
     */
    function reducer(userFn, recur, reduction, collection){
        var finished = collection.length === 0,
            newReduction = finished ? reduction : userFn(reduction, j.first(collection));
            
        return finished ? reduction : recur(newReduction, j.rest(collection));
    }

    function reduce(userFn, values, initialState){
        var appliedReducer = j.partial(reducer, userFn),
            initialValue = j.isUndefined(initialState) ? j.first(values) : initialState,
            remainder = j.isUndefined(initialState) ? j.rest(values) : values;
            
        return (!!values && values.length > 0) ? recur(appliedReducer, initialValue, remainder) : initialValue;
    }


    // Adapter function for reduce to allow for simplification of
    // array construction behaviors like map and filter
    function arrayReduceAdapter(reducerFn, userFn, valueList){
        var appliedReducer = j.partial(reducerFn, userFn),
            result = reduce(appliedReducer, valueList, []);
        
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

    function predicateAccumulator(predicate, total, value){
        var sanitizedTotal = j.either(0, total, 'number');
        console.log(total, value, predicate(value));
        return predicate(value) ? sanitizedTotal + 1 : sanitizedTotal;
    }

    function numberOf(predicate, valueSet){
        var accumulator = j.partial(predicateAccumulator, predicate);
        return reduce(accumulator, j.either([], valueSet), 0);
    }

    //Performs 'and' operation on valueSet
    function ander(a, b){
        return a && b;
    }

    function orer(a, b){
        return a || b;
    }

    function reduceConditions(conditionArgs, operator, initialCondition){
        var args = j.map(Boolean, j.slice(0, conditionArgs));
        return Boolean(reduce(operator, args, initialCondition));
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

    function captureUnique(finalList, value){
        return j.last(finalList) === value ? finalList : j.conj(value, finalList);
    }
    
    function unique(valueSet){
        return reduce(captureUnique, j.sort(j.slice(0, valueSet)), []);
    }

    function partialReverse(){
        return j.apply(j.compose(j.reverseArgs, j.partial),
                       j.slice(0, arguments));
    }

    function dereferencer(dataObject, token){
        var key = j.either('', token).trim();
        return key === '' ? dataObject : j.pick(token, dataObject);
    }

    function deref(baseData, key, defaultValue){
        var sanitizedDefault = defaultValue === undefined ? null : defaultValue,
            keyTokens = j.either('', key, 'string').split('.'),
            result = reduce(dereferencer, keyTokens, j.either(null, baseData, 'object'));
        
        return j.either(sanitizedDefault, result);
    }

    function union(set1, set2){
        return j.compose(j.unique, j.concat)(set1, set2);
    }

    function addToHash(finalObject, value){
        finalObject[value] = true;
        return finalObject;
    }

    function buildValueHash(valueList){
        return j.either({}, reduce(addToHash, valueList, {}));
    }

    function captureIntersection(valueHash, finalList, value){
        return valueHash[value] ? j.conj(value, finalList) : finalList;
    }
    
    function intersect(set1, set2){
        var setHash = buildValueHash(j.either([], set2));
        return reduce(j.partial(captureIntersection, setHash), set1, []); 
    }

    function captureDifference(valueHash, finalList, value){
        return !valueHash[value] ? j.conj(value, finalList) : finalList;
    }
    
    function difference(set1, set2){
        var setHash = buildValueHash(j.either([], set2));
        return reduce(j.partial(captureDifference, setHash), set1, []);
    }

    function symmetricDifference(set1, set2){
        var setUnion = union(set1, set2),
            setIntersection = intersect(set1, set2);

        return difference(setUnion, setIntersection);
    }

    j.and = and;
    j.compact = j.partial(filter, j.isTruthy);
    j.compose = compose;
    j.curry = curry;
    j.deref = deref;
    j.difference = difference;
    j.filter = filter;
    j.intersect = intersect;
    j.map = map;
    j.numberOf = numberOf;
    j.or = or;
    j.partialReverse = partialReverse;
    j.pipeline = pipeline;
    j.recur = recur;
    j.reduce = reduce;
    j.symmetricDifference = symmetricDifference;
    j.union = union;
    j.unique = unique;
    j.xor = xor;

})(jfp);
