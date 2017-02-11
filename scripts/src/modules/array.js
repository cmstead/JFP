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
        return function (values) {
            var result = j.argumentsToArray(values);

            result.splice(index, 1);

            return result;
        };
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

    function foldl(fn, initial) {
        return function (values) {
            var initialIsDefined = !j.isUndefined(initial);
            var result = initialIsDefined ? initial : first(values);
            var listLen = values.length;
            var i = initialIsDefined ? -1 : 0;

            while (++i < listLen) {
                result = fn(result, values[i]);
            }

            return result;
        };
    }

    function foldr(fn, initial) {
        var foldPredef = foldl(fn, initial);
        return function (values) {
            return foldPredef(reverse(values));
        }
    }

    function operationApplicator(operation) {
        return function (behavior, initial) {
            return function (fn) {
                var appliedOperation = operation(behavior(fn), initial);

                return function (values) {
                    return appliedOperation(values);
                };
            };
        };
    }

    function filterer(pred) {
        return function (result, value) {
            return pred(value) ? pushUnsafe(result)(value) : result; //j.conj(value, result) : result;
        };
    }

    function mapper(fn) {
        return function (result, value) {
            return pushUnsafe(result)(fn(value));
        };
    }

    function buildGetPartitionIndex (pred) {
        return function (value) {
            return pred(value) ? 0 : 1;
        };
    }

    function partitioner(pred) {
        var getIndex = buildGetPartitionIndex(pred);
        return function (result, value) {
            pushUnsafe(result[getIndex(value)])(value);
            return result;
        };
    }

    function find(pred) {
        return function (values) {
            var result = values[0];
            var listLen = values.length;

            for (var i = 1; !(i > listLen); i++) {
                if(pred(result)){ return result; }
                result = values[i];
            }

            return j.maybeDefined(result);
        };
    }

    var foldlApplicator = operationApplicator(foldl);

    function filter (pred) {
        return foldlApplicator(filterer, [])(pred);
    }

    function map (fn) {
        return foldlApplicator(mapper, [])(fn);
    }

    function partition (pred) {
        return foldlApplicator(partitioner, [[], []])(pred);
    }

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

    function until(pred) {
        return function (action, initial) {
            return function (values) {
                var result = initial;
                var value;

                for (var i = 0; i < values.length; i++) {
                    value = values[i];

                    if(pred(value)) { return result; }
                    result = action(result, value);
                }

                return result;
            };
        };
    }

    function takeUntil(pred) {
        var untilPred = until(pred)

        return function (values) {
            return untilPred(takeValue, [])(values);
        };

        function takeValue(result, value) {
            return pushUnsafe(result)(value);
        }
    }

    function some(pred) {
        return function (values) {
            var exists = false;
            var listLen = values.length;

            for (var i = 0; i < listLen && !exists; i++) {
                exists = pred(values[i]);
            }

            return exists;
        };
    }

    function none(pred) {
        return some(j.invert(pred));
    }

    function all(pred) {
        return j.invert(some(j.invert(pred)));
    }


    j.all = j.enforce('function => array => boolean', all);
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
    j.none = j.enforce('function => array => boolean', none);
    j.nth = j.enforce('index => array => maybe<defined>', nth);
    j.partition = j.enforce('function => array => tuple<array;array>', partition);
    j.pushUnsafe = j.enforce('array => * => array', pushUnsafe);
    j.rest = rest;
    j.reverse = j.enforce('array => array', reverse);
    j.rfilter = j.enforce('function => array => array', rfilter);
    j.rmap = j.enforce('function => array => array', rmap);
    j.rpartition = j.enforce('function => array => array<array;array>', rpartition);
    j.rreduce = j.enforce('function, [*] => array => *', rreduce);
    j.some = j.enforce('function => array => boolean', some);
    j.sort = j.enforce('[*] => array => array', sort);
    j.take = j.enforce('[index] => function<array>', take);
    j.takeUntil = j.enforce('predicate => array => array', takeUntil);
    j.until = j.enforce('predicate => function, * => array => *', until);

})(jfp);