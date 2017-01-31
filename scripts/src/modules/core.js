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
        return valuesA.concat(valuesB);
    }

    function rconcat(valuesA, valuesB) {
        return concat(valuesB, valuesA);
    }

    function cons(value, values) {
        return typeof value === 'undefined' ? values : [value].concat(values);
    }

    function conj(value, values) {
        return typeof value === 'undefined' ? values : values.concat([value]);
    }

    function slice(start, end) {
        var bounds = typeof end === 'undefined' ? [start] : [start, end];

        return function (valueSet) {
            return Array.prototype.slice.apply(valueSet, bounds);
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

    function pick(key) {
        return function (obj) {
            try {
                return j.maybeDefined(obj[key]);
            } catch (e) {
                return null;
            }
        };
    }

    var pickId = pick('id');

    function recur(fn) {
        // Each recursion needs to be signed to avoid collisions
        var id = Math.floor(Math.random() * 1000000);

        return function () {
            var result = {
                id: id,
                args: argumentsToArray(arguments)
            };

            function recursor () {
                result.args = argumentsToArray(arguments);
                return result;
            }

            while (pickId(result) === id) {
                result = apply(fn, [recursor].concat(result.args));
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

    function buildCurriable(fn, count, initialArgs) {
        return function curriable() {
            var args = concat(initialArgs, argumentsToArray(arguments));
            return !(args.length < count) ? apply(fn, args) : buildCurriable(fn, count, args);
        }
    }

    function curry(fn, count, args) {
        return buildCurriable(fn, j.eitherNatural(fn.length)(count), j.eitherArray([])(args));
    };

    var sliceRest = slice(1);

    function directionalPartial(concat) {
        return function (fn) {
            var args = sliceRest(arguments);

            return function () {
                return apply(fn, concat(args, argumentsToArray(arguments)));
            };
        };
    }

    var partial = directionalPartial(concat);
    var rpartial = directionalPartial(rconcat);

    function repeat(fn, optionalPred) {
        var pred = j.eitherFunction(always(true))(optionalPred);

        return function (count) {
            return function (value) {
                var result = value;
                for (var i = 0; i < count; i++) {
                    result = fn(result);
                }
                return result;
            }
        }
    }

    // JFP core functions
    j.always = j.enforce('* => * => *', always);
    j.apply = j.enforce('function, array<*> => *', apply);
    j.argumentsToArray = j.enforce('arguments => array', argumentsToArray);
    j.compose = j.enforce('function, function => function', compose);
    j.concat = curry(j.enforce('concatable, concatable => concatable', concat), 2);
    j.conj = j.enforce('*, array<*> => array<*>', conj);
    j.cons = j.enforce('*, array<*> => array<*>', cons);
    j.curry = j.enforce('function, [int], [array<*>] => [*] => *', curry);
    j.identity = j.enforce('* => *', identity);
    j.partial = j.enforce('function, [*] => [*] => *', partial);
    j.pick = j.enforce('string => * => maybe<defined>', pick);
    j.recur = j.enforce('function => function', recur);
    j.repeat = j.enforce('function => int => * => *', repeat);
    j.rpartial = j.enforce('function, [*] => [*] => *', rpartial);
    j.reverseArgs = j.enforce('function => [*] => *', reverseArgs);
    j.slice = j.enforce('int, [int] => variant<array;arguments> => array', slice);
    j.splice = j.enforce('int, [int] => array<*> => array<*>', splice);

})(jfp);
