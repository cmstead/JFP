(function (j) {
    'use strict';

    function nth(index) {
        return function (values) {
            return j.maybe('defined')(values[index]);
        };
    }

    function lastIndexOf(values) {
        var length = values.length;
        return length === 0 ? length : length - 1;
    }

    function take(count) {
        return function (values) {
            return j.slice(0)(values, count);
        };
    }

    function drop(index) {
        return function (values) {
            var result = j.slice(0)(values);
            result.splice(index, 1);
            return result;
        };
    }

    function folder(fn) {
        var isNil = j.isTypeOf('nil');

        return j.recur(function (recur, result, values) {
            return isNil(values) ? result : recur(fn(result, j.first(values)), j.rest(values));
        });
    }

    function fold(direction) {
        return function (fn, initial) {
            return function (values) {
                var noInitial = j.isTypeOf('undefined')(initial);
                var valueSet = direction === 'left' ? values : values.reverse();
                
                var value = noInitial ? j.first(valueSet) : initial;
                var list = noInitial ? j.rest(valueSet) : valueSet;
                
                return folder(fn)(value, list);
            };
        };
    }

    j.drop = j.enforce('index => array<*> => array<*>', drop);
    j.first = j.enforce('array<*> => maybe<*>', nth(0));
    j.foldl = j.enforce('function, [*] => array<*> => *', fold('left'));
    j.foldr = j.enforce('function, [*] => array<*> => *', fold('right'));
    j.lastIndexOf = j.enforce('array<*> => index', lastIndexOf);
    j.nth = j.enforce('index => array<*> => maybe<*>', nth);
    j.rest = j.slice(1);
    j.take = j.enforce('index => array<*> => array<*>', take);

})(jfp);