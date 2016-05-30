(function (j) {
    'use strict';
    
    function nth (index){
        return function (values) {
            return j.maybe('defined')(values[index]);
        };
    }
    
    function lastIndexOf (values){
        var length = values.length;
        return length === 0 ? length : length - 1;
    }
    
    function take (count){
        return function (values) {
            return j.slice(0)(values, count);
        };
    }
    
    function drop (index){
        return function (values) {
            var result = j.slice(0)(values);
            result.splice(index, 1);
            return result;
        };
    }
    
    j.drop = j.enforce('index => array<*> => array<*>', drop);
    j.first = j.enforce('array<*> => maybe<*>', nth(0));
    j.lastIndexOf = j.enforce('array<*> => index', lastIndexOf);
    j.nth = j.enforce('index => array<*> => maybe<*>', nth);
    j.rest = j.slice(1);
    j.take = j.enforce('index => array<*> => array<*>', take);
    
})(jfp);