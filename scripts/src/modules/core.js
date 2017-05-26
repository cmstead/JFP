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
        return function (valueSet) {
            return Array.prototype.slice.call(valueSet, start, end);
        };
    }

    var argumentsToArray = slice(0);

    var sliceFrom0 = slice(0);

    function apply(fn, args) {
        return fn.apply(null, args);
    }

    function pick(key) {
        return function (obj) {
            try {
                var result = j.maybeDefined(obj[key]);
            } catch (e) {
                var result = null;
            }

            return result;
        };
    }

    var pickId = pick('id');

    function buildRecursor(result) {
        return function () {
            result.args = sliceFrom0(arguments);
            return result;
        }
    }

    function recur(fn) {
        // Each recursion needs to be signed to avoid collisions
        var id = Math.floor(Math.random() * 1000000);

        return function () {
            var result = {
                id: id,
                args: sliceFrom0(arguments)
            };
            var recursor = buildRecursor(result);

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
            return f(g.apply(null, sliceFrom0(arguments)));
        };
    }

    function rcompose(g, f) {
        return compose(f, g);
    }

    function directionalCompose(composer) {
        return function (f, g) {
            var fns = sliceFrom0(arguments);
            var result = f;

            for (var i = 1; i < fns.length; i++) {
                result = composer(result, fns[i]);
            }

            return result;
        };
    }

    function reverseArgs(fn) {
        return function () {
            return apply(fn, sliceFrom0(arguments).reverse());
        };
    }

    function buildCurriable(fn, count, initialArgs) {
        return function curriable() {
            var args = concat(initialArgs, sliceFrom0(arguments));
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
                return apply(fn, concat(args, sliceFrom0(arguments)));
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
    j.always = j.sign('value:* => [*] => value:*', always);
    j.apply = j.enforce('application:function, arguments:array<*> => result:*', apply);
    j.argumentsToArray = j.enforce('arguments => array', sliceFrom0);
    j.compose = j.enforce('f:function, g:function => fog:function', compose);
    j.concat = curry(j.enforce('A isTypeOf B :: A:concatable, B:concatable => concatenation:concatable', concat), 2);
    j.conj = j.enforce('value:*, values:array<*> => result:array<*>', conj);
    j.cons = j.enforce('value:*, values:array<*> => result:array<*>', cons);
    j.curry = j.enforce('toCurry:function, arity:[int], initialArgs:[array<*>] => additionalArgs:[*] => result:*', curry);
    j.foldlCompose = j.enforce('f:function, g:function => fog:function', directionalCompose(compose));
    j.foldrCompose = j.enforce('f:function, g:function => gof:function', directionalCompose(rcompose));
    j.identity = j.sign('value:* => value:*', identity);
    j.partial = j.enforce('application:function, applicationArguments:[*] => additionalArgs:[*] => result:*', partial);
    j.pick = j.enforce('key:string => value:* => result:maybe<defined>', pick);
    j.rcompose = j.enforce('f:function, g:function => gof:function', rcompose);
    j.recur = j.enforce('recursiveFn:function => recursorFn:function', recur);
    j.repeat = j.enforce('application:function => repeatCount:int => value:* => result:*', repeat);
    j.rpartial = j.enforce('application:function, applicationArguments:[*] => additionalArgs:[*] => result:*', rpartial);
    j.reverseArgs = j.enforce('originalFunction:function => reversedArgs:[*] => result:*', reverseArgs);
    j.slice = j.enforce('startIndex:int, endIndex:[int] => objectToSlice:variant<array;arguments> => result:array', slice);

})(jfp);
