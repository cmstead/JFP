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
    j.last = last;
    j.lastIndex = lastIndex;
    j.map = map;
    j.nth = nth;
    j.reduce = reduce;
    j.rest = rest;
    j.take = take;

})(jfp);