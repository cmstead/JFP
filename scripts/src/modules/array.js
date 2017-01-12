(function (j) {
    'use strict';

    function nth(index) {
        return function (values) {
            return j.maybeDefined(values[index]);
        };
    }


    function lastIndexOf(values) {
        return j.eitherNatural(0)(values.length - 1);
    }

    function dropNth(index) {
        return function (values) {
            var result = j.slice(0)(values);
            result.splice(index, 1);
            return result;
        };
    }

    var first = nth(0);
    var rest = j.slice(1);

    function isFoldBreak(value) {
        return typeof value === 'undefined' || 
            value === null || 
            value === false;
    }

    function reverse(values) {
        return j.slice(0)(values).reverse();
    }

    function folder(fn) {
        return j.recur(function (recur, result, values) {
            return j.isNil(values) || isFoldBreak(result) ? result : recur(fn(result, first(values)), rest(values));
        });
    }

    function fold(directionProcess) {
        return function (fn, initial) {
            return function (values) {
                var valueSet = directionProcess(values);

                var value = j.isUndefined(initial) ? first(valueSet) : initial;
                var list = j.isUndefined(initial) ? rest(valueSet) : valueSet;

                return folder(fn)(value, list);
            };
        };
    }

    function operationApplicator(operation) {
        return function (behavior, initial) {
            return function (fn) {
                return function (values) {
                    return operation(behavior(fn), initial)(values);
                };
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

    function partitioner(pred) {
        return function (result, value) {
            var index = pred(value) ? 0 : 1;
            result[index] = j.conj(value, result[index]);
            return result;
        };
    }

    function find(pred) {
        return function (values) {
            return j.recur(finder)(values);

            function finder(recur, values) {
                var value = first(values);
                return j.isNil(values) || pred(value) ? value : recur(rest(values));
            }
        };
    }

    var foldApplicator = operationApplicator(fold(j.identity));
    var filter = foldApplicator(filterer, []);
    var map = foldApplicator(mapper, []);
    var partition = foldApplicator(partitioner, [[], []]);

    function rreduceRecur (recur, fn, lastResult, values) {
        var firstValue = first(values);
        var restValues = rest(values);
        var firstIsArray = j.isArray(firstValue);

        var nextResult = firstIsArray ? lastResult : fn(lastResult, firstValue);
        var nextRemaining = firstIsArray ? j.concat(restValues, firstValue) : restValues;

        return recur(nextResult, nextRemaining);
    }

    function rreduce(fn, initialValue) {
        return function (values) {
            var initValue = j.eitherDefined(first(values))(initialValue);
            var remaining = j.isUndefined(initialValue) ? rest(values) : values;

            return j.recur(function (recur, lastResult, values) {
                return j.isNil(values) ? lastResult : rreduceRecur(recur, fn, lastResult, values);
            })(initValue, remaining);
        };
    }

    var rreduceApplicator = operationApplicator(rreduce);
    var rfilter = rreduceApplicator(filterer, []);
    var rmap = rreduceApplicator(mapper, []);
    var rpartition = rreduceApplicator(partitioner, [[], []]);

    function sort(comparator) {
        return function (values) {
            return j.slice(0)(values).sort(j.eitherFunction(j.subtract)(comparator));
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
    j.first = j.enforce('array<*> => maybe<defined>', first);
    j.find = j.enforce('function<*> => array<*> => maybe<defined>', find);
    j.foldl = j.enforce('function, [*] => array<*> => *', fold(j.identity));
    j.foldr = j.enforce('function, [*] => array<*> => *', fold(reverse));
    j.lastIndexOf = j.enforce('array<*> => index', lastIndexOf);
    j.map = j.enforce('function => array<*> => array<*>', map);
    j.none = j.enforce('function => array<*> => boolean', none);
    j.nth = j.enforce('index => array<*> => maybe<defined>', nth);
    j.partition = j.enforce('function => array<*> => array<array<*>;array<*>>', partition);
    j.rest = rest;
    j.reverse = j.enforce('array<*> => array<*>', reverse);
    j.rfilter = j.enforce('function => array<*> => array<*>', rfilter);
    j.rmap = j.enforce('function => array<*> => array<*>', rmap);
    j.rpartition = j.enforce('function => array<*> => array<array<*>;array<*>>', rpartition);
    j.rreduce = j.enforce('function, [*] => array<*> => *', rreduce);
    j.some = j.enforce('function => array<*> => boolean', some);
    j.sort = j.enforce('[*] => array<*> => array<*>', sort);
    j.take = j.enforce('[index] => function<array<*>>', take);

})(jfp);