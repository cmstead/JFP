(function (j) {
    'use strict';

    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    function nth(index) {
        return function (values) {
            return j.maybeDefined(values[index]);
        };
    }

    function lastIndexOf(values) {
        return j.eitherNatural(0)(values.length - 1);
    }

    function dropNth(index) {
        return j.splice(index, 1);
    }

    var first = nth(0);
    var rest = j.slice(1);

    function last(values) {
        return j.nth(lastIndexOf(values))(values);
    }

    function dropLast(values) {
        return j.slice(0, lastIndexOf(values))(values);
    }

    function isFoldBreak(value) {
        return typeof value === 'undefined' ||
            value === null ||
            value === false;
    }

    function reverse(values) {
        return j.slice(0)(values).reverse();
    }

    function folder(fn, takeValue, takeRest) {
        return j.recur(function (recur, result, values) {
            return j.isNil(values) || isFoldBreak(result) ? result : recur(fn(result, takeValue(values)), takeRest(values));
        });
    }

    function fold(takeValue, takeRest) {
        return function (fn, initial) {
            return function (values) {
                var value = j.isUndefined(initial) ? takeValue(values) : initial;
                var list = j.isUndefined(initial) ? takeRest(values) : values;

                return folder(fn, takeValue, takeRest)(value, list);
            };
        };
    }

    var foldl = fold(first, rest);
    var foldr = fold(last, dropLast);

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

    var foldlApplicator = operationApplicator(foldl);
    var filter = foldlApplicator(filterer, []);
    var map = foldlApplicator(mapper, []);
    var partition = foldlApplicator(partitioner, [[], []]);

    function rreduceRecur(recur, fn, lastResult, values) {
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

    function existence(methodBuilder) {
        return function (pred) {
            var method = methodBuilder(pred);

            return function (values) {
                return j.recur(method)(values);
            }
        };
    }

    function buildEvery(pred) {
        return function every(recur, values) {
            return !pred(first(values)) ? j.isNil(values) : recur(rest(values));
        }
    }

    function buildNever(pred) {
        return function never(recur, values) {
            var result = pred(first(values))
            return j.isNil(values) || result ? !result : recur(rest(values));
        }
    }

    function buildAtLeastOne(pred) {
        return function atLeastOne(recur, values) {
            var result = pred(first(values))
            return j.isNil(values) || result ? result : recur(rest(values));
        }
    }

    function take(count) {
        return j.slice(0, count);
    }

    function pushUnsafe(values) {
        return function (value) {
            values.push(value);
            return values;
        }
    }

    function until(pred){
        return function (action, initial){
            return function (values) {
                return j.recur(actUntil)(initial, values);

                function actUntil (recur, result, values) {
                    var value = first(values);
                    return j.isNil(values) || pred(value) ? result : recur(action(result, value), rest(values));
                };
            };
        };
    }

    function takeUntil(pred) {
        return until(pred)(j.reverseArgs(j.conj), []);

        function takeValue(result, value) {
            return j.pushUnsafe(result)(value);
        }
    }

    j.all = j.enforce('function => array => boolean', existence(buildEvery));
    j.compact = j.enforce('[array] => array', filter(Boolean));
    j.dropLast = j.enforce('array => array', dropLast);
    j.dropNth = j.enforce('index => array => array', dropNth);
    j.filter = j.enforce('function => array => array', filter);
    j.first = j.enforce('array => maybe<defined>', first);
    j.find = j.enforce('function<*> => array => maybe<defined>', find);
    j.foldl = j.enforce('function, [*] => array => *', foldl);
    j.foldr = j.enforce('function, [*] => array => *', foldr);
    j.lastIndexOf = j.enforce('array => index', lastIndexOf);
    j.map = j.enforce('function => array => array', map);
    j.none = j.enforce('function => array => boolean', existence(buildNever));
    j.nth = j.enforce('index => array => maybe<defined>', nth);
    j.partition = j.enforce('function => array => tuple<array;array>', partition);
    j.rest = rest;
    j.reverse = j.enforce('array => array', reverse);
    j.rfilter = j.enforce('function => array => array', rfilter);
    j.rmap = j.enforce('function => array => array', rmap);
    j.rpartition = j.enforce('function => array => array<array;array>', rpartition);
    j.rreduce = j.enforce('function, [*] => array => *', rreduce);
    j.some = j.enforce('function => array => boolean', existence(buildAtLeastOne));
    j.sort = j.enforce('[*] => array => array', sort);
    j.take = j.enforce('[index] => function<array>', take);
    j.takeUntil = j.enforce('predicate => array => array', takeUntil);
    j.until = j.enforce('predicate => function, * => *', until);

})(jfp);