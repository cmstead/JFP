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
            var result = j.argumentsToArray(values);

            result.splice(index, 1);

            return result;
        };
    }

    var first = nth(0);
    var rest = j.slice(1);

    function dropLast(values) {
        return j.slice(0, lastIndexOf(values))(values);
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
            return pred(value) ? pushUnsafe(result)(value) : result;
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


    j.all = j.enforce('predicate:function => values:array => result:boolean', all);
    j.compact = j.enforce('values:[array] => result:array', filter(Boolean));
    j.dropLast = j.enforce('values:array => result:array', dropLast);
    j.dropNth = j.enforce('dropIndex:index => values:array => result:array', dropNth);
    j.filter = j.enforce('predicate:function => values:array => result:array', filter);
    j.first = j.enforce('values:array => firstValue:maybe<defined>', first);
    j.find = j.enforce('predicate:function => values:array => foundValue:maybe<defined>', find);
    j.foldl = j.enforce('application:function, initialValue:[*] => values:array => result:*', foldl);
    j.foldr = j.enforce('application:function, initialValue:[*] => values:array => result:*', foldr);
    j.lastIndexOf = j.enforce('values:array => lastIndex:index', lastIndexOf);
    j.map = j.enforce('application:function => values:array => result:array', map);
    j.none = j.enforce('predicate:function => values:array => result:boolean', none);
    j.nth = j.enforce('valueIndex:index => values:array => result:maybe<defined>', nth);
    j.partition = j.enforce('predicate:function => values:array => partitionedValues:tuple<array;array>', partition);
    j.pushUnsafe = j.enforce('valueArray:array => pushValue:* => valueArray:array', pushUnsafe);
    j.rest = rest;
    j.reverse = j.enforce('values:array => result:array', reverse);
    j.rfilter = j.enforce('predicate:function => values:array => result:array', rfilter);
    j.rmap = j.enforce('application:function => values:array => result:array', rmap);
    j.rpartition = j.enforce('predicate:function => values:array => partitionedValues:array<array;array>', rpartition);
    j.rreduce = j.enforce('application:function, initialValue:[*] => values:array => result:*', rreduce);
    j.some = j.enforce('predicate:function => values:array => result:boolean', some);
    j.sort = j.enforce('comparator:[*] => values:array => sortedValues:array', sort);
    j.take = j.enforce('endIndex:[index] => function', take);
    j.takeUntil = j.enforce('predicate:function => values:array => result:array', takeUntil);
    j.until = j.enforce('predicate:function => application:function, initialValue:[*] => values:array => result:*', until);

})(jfp);
