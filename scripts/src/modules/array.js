(function (j) {
    'use strict';

    var isNil = j.isTypeOf('nil');

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
            return j.slice(0, count)(values);
        };
    }

    function dropNth(index) {
        return function (values) {
            var result = j.slice(0)(values);
            result.splice(index, 1);
            return result;
        };
    }

    var reverse = j.partial(j.recur(reverser), []);
    
    function reverser(recur, result, valueSet) {
        return !isNil(valueSet) ? 
            recur(j.cons(j.first(valueSet), result), j.rest(valueSet)) : 
            result;
    }

    function folder(fn) {
        return j.recur(function (recur, result, values) {
            return isNil(values) ? result : recur(fn(result, j.first(values)), j.rest(values));
        });
    }

    function fold(direction) {
        return function (fn, initial) {
            return function (values) {
                var noInitial = j.isTypeOf('undefined')(initial);
                var valueSet = direction === 'left' ? values : reverse(values);

                var value = noInitial ? j.first(valueSet) : initial;
                var list = noInitial ? j.rest(valueSet) : valueSet;

                return folder(fn)(value, list);
            };
        };
    }

    function foldApplicator(behavior) {
        return function (fn) {
            return function (values) {
                return fold('left')(behavior(fn), [])(values);
            };
        };
    }

    function filterer(pred) {
        return function (result, value) {
            return pred(value) ? j.conj(value, result) : result;
        };
    }

    function mapper(fn) {
        return function (result, value) {
            return j.conj(fn(value), result);
        };
    }

    function some(pred) {
        return j.recur(check);

        function check(recur, values) {
            var match = pred(j.first(values));
            var done = j.isTypeOf('nil')(values);

            return match || done ? match && !done : recur(j.rest(values));
        }
    }

    var none = j.compose(j.invert, some);
    var all = j.compose(none, j.invert);
    
    var filter = foldApplicator(filterer);
    var map = foldApplicator(mapper);

    j.all = j.enforce('function<*> => array<*> => boolean', all);
    j.dropNth = j.enforce('index => array<*> => array<*>', dropNth);
    j.filter = j.enforce('function<*> => array<*> => array<*>', filter);
    j.first = j.enforce('array<*> => maybe<*>', nth(0));
    j.foldl = j.enforce('function<*;*>, [*] => array<*> => *', fold('left'));
    j.foldr = j.enforce('function<*;*>, [*] => array<*> => *', fold('right'));
    j.lastIndexOf = j.enforce('array<*> => index', lastIndexOf);
    j.map = j.enforce('function<*> => array<*> => array<*>', map);
    j.none = j.enforce('function<*> => array<*> => boolean', none);
    j.nth = j.enforce('index => array<*> => maybe<*>', nth);
    j.rest = j.slice(1);
    j.reverse = j.enforce('array<*> => array<*>', reverse);
    j.some = j.enforce('function<*> => array<*> => boolean', some);
    j.take = j.enforce('index => array<*> => array<*>', take);

})(jfp);