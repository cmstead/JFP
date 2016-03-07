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
