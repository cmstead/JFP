(function (j) {
    'use strict';

    function nth(index) {
        return function (values) {
            return j.maybe('defined')(values[index]);
        };
    }

    function lastIndexOf(values) {
        return j.either('natural')(0)(values.length - 1);
    }

    function dropNth(index) {
        return function (values) {
            var result = j.slice(0)(values);
            result.splice(index, 1);
            return result;
        };
    }

    function reverse(values) {
        return j.slice(0)(values).reverse();
    }

    function folder(fn) {
        return j.recur(function (recur, result, values) {
            return j.isNil(values) ? result : recur(fn(result, j.first(values)), j.rest(values));
        });
    }

    function fold(directionProcess) {
        return function (fn, initial) {
            return function (values) {
                var valueSet = directionProcess(values);

                var value = j.isUndefined(initial) ? j.first(valueSet) : initial;
                var list = j.isUndefined(initial) ? j.rest(valueSet) : valueSet;

                return folder(fn)(value, list);
            };
        };
    }

    function foldApplicator(behavior) {
        return function (fn) {
            return function (values) {
                return j.foldl(behavior(fn), [])(values);
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

    function find(pred) {
        return function (values) {
            return j.recur(finder)(values);

            function finder(recur, values) {
                var value = j.first(values);
                return j.isNil(values) || pred(value) ? value : recur(j.rest(values));
            }
        };
    }

    var filter = foldApplicator(filterer);
    var map = foldApplicator(mapper);

    function sort(comparator) {
        return function (values) {
            return j.slice(0)(values).sort(j.either('function')(j.subtract)(comparator));
        };
    }

    function some(pred) {
        return function (values) {
            return filter(pred)(values).length > 0;
        };
    }

    function none(pred) { return j.compose(j.invert, some)(pred); }
    function all(pred) { return j.compose(none, j.invert)(pred); }
    function take(count) { return j.slice(0, count); }

    j.all = j.enforce('function => array<*> => boolean', all);
    j.compact = j.enforce('[array] => array<*>', filter(Boolean));
    j.dropNth = j.enforce('index => array<*> => array<*>', dropNth);
    j.filter = j.enforce('function => array<*> => array<*>', filter);
    j.first = j.enforce('array<*> => maybe<defined>', nth(0));
    j.find = j.enforce('function<*> => array<*> => maybe<defined>', find);
    j.foldl = j.enforce('function, [*] => array<*> => *', fold(j.identity));
    j.foldr = j.enforce('function, [*] => array<*> => *', fold(reverse));
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