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

    function dropNth(index) {
        return function (values) {
            var result = j.slice(0)(values);
            result.splice(index, 1);
            return result;
        };
    }

    function reverse(values) {
        return j.recur(reverser)([], values);

        function reverser(recur, result, valueSet) {
            return !isNil(valueSet) ?
                recur(j.cons(j.first(valueSet), result), j.rest(valueSet)) :
                result;
        }
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

    function find (pred){
        return function (values) {
            return j.recur(finder)(values);
            
            function finder (recur, values){
                var value = j.first(values);
                return isNil(values) || pred(value) ? value : recur(j.rest(values));
            }
        };
    }

    function some(pred) {
        return j.recur(check);

        function check(recur, values) {
            var match = pred(j.first(values));
            var done = isNil(values);

            return match || done ? match && !done : recur(j.rest(values));
        }
    }

    function sort (comparator){
        return function (values) {
            var valuesCopy = j.slice(0)(values);

            if(j.isTypeOf('function')(comparator)) {
                valuesCopy.sort(comparator);
            } else {
                valuesCopy.sort();
            }

            return valuesCopy; 
        };
    }

    function none(pred) { return j.compose(j.invert, some)(pred); }
    function all(pred) { return j.compose(none, j.invert)(pred); }
    function take(count) { return j.slice(0, count); }

    var filter = foldApplicator(filterer);
    var map = foldApplicator(mapper);

    j.all = j.enforce('function => array<*> => boolean', all);
    j.compact = j.enforce('[array] => array<*>', filter(Boolean));
    j.dropNth = j.enforce('index => array<*> => array<*>', dropNth);
    j.filter = j.enforce('function => array<*> => array<*>', filter);
    j.first = j.enforce('array<*> => maybe<defined>', nth(0));
    j.find = j.enforce('function<*> => array<*> => maybe<defined>', find);
    j.foldl = j.enforce('function, [*] => array<*> => *', fold('left'));
    j.foldr = j.enforce('function, [*] => array<*> => *', fold('right'));
    j.lastIndexOf = j.enforce('array<*> => index', lastIndexOf);
    j.map = j.enforce('function => array<*> => array<*>', map);
    j.none = j.enforce('function => array<*> => boolean', none);
    j.nth = j.enforce('index => array<*> => maybe<defined>', nth);
    j.rest = j.slice(1);
    j.reverse = j.enforce('array<*> => array<*>', reverse);
    j.some = j.enforce('function => array<*> => boolean', some);
    j.sort = j.enforce('[*] => array<*> => array<*>', sort);
    j.take = j.enforce('[index] => function<array<*>>', take);

})(jfp);