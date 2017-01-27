(function (j) {
    'use strict';

    function identity(value) {
        return value;
    }

    function always(value) {
        return function () {
            return value;
        };
    }

    function concat(valuesA, valuesB) {
        return j.eitherConcatable([])(valuesA).concat(valuesB);
    }

    function cons(value, values) {
        return j.isUndefined(value) ? values : concat([value], values);
    }

    function conj(value, values) {
        return j.isUndefined(value) ? values : concat(values, [value]);
    }

    function slice(start, end) {
        return function (valueSet) {
            return Array.prototype.slice.apply(valueSet, cons(start, cons(end, j.nil)));
        };
    }

    var argumentsToArray = slice(0);

    function splice(index, length) {
        return function (values) {
            var result = argumentsToArray(values);
            var count = j.eitherNatural(values.length - index)(length);

            result.splice(index, count);

            return result;
        }
    }

    function apply(fn, args) {
        return fn.apply(null, args);
    }

    function buildResult(id, args) {
        return {
            id: id,
            args: args
        };
    }

    function recursor(id) {
        return function () {
            return buildResult(id, argumentsToArray(arguments));
        };
    }

    function checkRecurResult(id) {
        return function (result) {
            return j.isObjectInstance(result) && result.id === id;
        };
    }

    function recur(fn) {
        // Each recursion needs to be signed to avoid collisions
        var id = Math.floor(Math.random() * 1000000);
        var signedRecursor = recursor(id);
        var checkResult = checkRecurResult(id);

        return function () {
            var result = buildResult(id, argumentsToArray(arguments));

            while (checkResult(result)) {
                result = apply(fn, cons(signedRecursor, result.args));
            }

            return result;
        };
    }

    function lastIndexOf(values) {
        return values.length - 1;
    }

    function compose(f, g) {
        return function () {
            var args = argumentsToArray(arguments);
            return f(g.apply(null, args));
        };
    }

    function reverseArgs(fn) {
        return function () {
            return apply(fn, argumentsToArray(arguments).reverse());
        };
    }

    function buildCurriable(fn, count, initialArgs, concat) {
        function curriable() {
            var args = concat(initialArgs, argumentsToArray(arguments));
            return args.length >= count ? apply(fn, args) : buildCurriable(fn, count, args, concat);
        }

        return curriable;
    }

    function directionalCurry(concat) {
        return function (fn, count, args) {
            return buildCurriable(fn, j.eitherNatural(fn.length)(count), j.eitherArray([])(args), concat);
        };
    }

    var curry = directionalCurry(concat);
    var rcurry = directionalCurry(reverseArgs(concat));

    function directionalPartial(concat) {
        var sliceRest = slice(1);

        return function (fn) {
            var args = sliceRest(arguments);

            return function () {
                return apply(fn, concat(args, argumentsToArray(arguments)));
            };
        };
    }

    var partial = directionalPartial(concat);
    var rpartial = directionalPartial(reverseArgs(concat));

    function repeat(fn, optionalPred) {
        var pred = j.eitherFunction(always(true))(optionalPred);

        return function (count) {
            return function (value) {
                var result = value;
                for(var i = 0; i < count; i++) {
                    result = fn(result);
                }
                return result;
            }
        }
    }

    // JFP core functions
    j.always = j.enforce('* => [*] => *', always);
    j.apply = j.enforce('function, array<*> => *', apply);
    j.argumentsToArray = j.enforce('arguments => array', argumentsToArray);
    j.compose = j.enforce('function, function => function', compose);
    j.concat = curry(j.enforce('concatable, concatable => concatable', concat), 2);
    j.conj = j.enforce('*, array<*> => array<*>', conj);
    j.cons = j.enforce('*, array<*> => array<*>', cons);
    j.curry = j.enforce('function, [int], [array<*>] => [*] => *', curry);
    j.rcurry = j.enforce('function, [int], [array<*>] => [*] => *', rcurry);
    j.identity = j.enforce('* => *', identity);
    j.partial = j.enforce('function, [*] => [*] => *', partial);
    j.recur = j.enforce('function => function', recur);
    j.repeat = j.enforce('function => int => * => *', repeat);
    j.rpartial = j.enforce('function, [*] => [*] => *', rpartial);
    j.reverseArgs = j.enforce('function => [*] => *', reverseArgs);
    j.slice = j.enforce('int, [int] => variant<array;arguments> => array', slice);
    j.splice = j.enforce('int, [int] => array<*> => array<*>', splice);

})(jfp);