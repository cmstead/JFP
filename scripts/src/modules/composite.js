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
            initialValue = j.eitherIf(j.first(values), initialState, !j.isUndefined(initialState)),
            remainder = j.eitherIf(j.rest(values), values, !j.isUndefined(initialState));
            
        return (!!values && values.length > 0) ? recur(appliedReducer, initialValue, remainder) : null;
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
        if(userPredicate(value)){
            finalArray.push(value);
        }
        
        return finalArray;
    }

    filter = j.partial(arrayReduceAdapter, filterer);

    //Performs 'and' operation on valueSet
    function ander(recur, current, valueSet){
        return (valueSet.length === 0) ?
            current :
            recur(current && Boolean(j.first(valueSet)), j.rest(valueSet));
    }

    function and(){
        return recur(ander, true, j.slice(0, arguments));
    }

    //Performs 'or' operation on valueSet
    function orer(recur, current, valueSet){
        return (valueSet.length === 0) ?
            current :
            recur(current || Boolean(j.first(valueSet)), j.rest(valueSet));
    }

    function or(){
        return recur(orer, false, j.slice(0, arguments));
    }

    function xor(a, b){
        return Boolean(or(a, b) && j.not(j.isTruthy(a) === j.isTruthy(b)));
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

    function pipeline(value){
        return j.apply(compose, j.slice(1, arguments).reverse())(value);
    }

    function captureUnique(finalList, value){
        if(j.last(finalList) !== value){
            finalList.push(value);
        }
        
        return finalList;
    }
    
    function unique(valueSet){
        var values = j.sort(j.slice(0, valueSet));
        return reduce(captureUnique, values, []);
    }

    function partialReverse(){
        var args = j.slice(0, arguments),
            partialAndReverse = j.compose(j.reverseArgs, j.partial);
            
        return j.apply(partialAndReverse, args);
    }

    function deref(baseData, key, defaultValue){
        var sanitizedDefault = j.either(null, defaultValue),
            keyTokens = j.either('', key).split('.'),
            derefValue = j.reduce(j.reverseArgs(j.pick), keyTokens, baseData),
            returnValue = Boolean(key) ? derefValue : baseData;
        
        returnValue = !Boolean(baseData) ? null : returnValue;
        
        return returnValue === null ? sanitizedDefault : returnValue;
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
        if(valueHash[value]){
            finalList.push(value);
        }

        return finalList;
    }
    
    function intersect(set1, set2){
        var setHash = buildValueHash(j.either([], set2));
        return reduce(j.partial(captureIntersection, setHash), set1, []); 
    }

    function captureDifference(valueHash, finalList, value){
        if(!valueHash[value]){
            finalList.push(value);
        }
        
        return finalList;
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
