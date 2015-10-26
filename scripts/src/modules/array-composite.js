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

    function firstExists (list) {
        return j.not(j.isNull(j.first(list)));
    }

    j.contains = contains;
    j.compact = compact;
    j.difference = difference;
    j.every = every;
	j.filter = filter;
    j.find = find;
    j.firstExists = firstExists;
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