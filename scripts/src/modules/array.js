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

    function contains(predicate, valueSet){
        var satisfied = false;

        function containsFn(value){
            satisfied = predicate(value);
            return !satisfied;
        }

        each(containsFn, valueSet);

        return satisfied;
    }

    j.conj = conj;
    j.cons = cons;
    j.contains = contains;
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
