(function (j) {
    'use strict';

    function identity(value) {
        return value;
    }

    function always(value) {
        return identity.bind(null, value);
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

    function splice(index, length) {        
        return function (values) {
            var result = j.slice(0)(values);
            var count = j.eitherNatural(values.length - index)(length);

            result.splice(index, count);

            return result;
        }
    }

    function apply(fn, args) {
        return fn.apply(null, args);
    }

    function recursor(id) {
        return function () {
            return {
                id: id,
                args: slice(0)(arguments)
            };
        };
    }

    function checkRecurResult(id) {
        return function (result) {
            var safeResult = j.eitherObjectInstance({})(result);

            return j.isNumber(safeResult.id) && j.isArray(safeResult.args) && result.id === id;
        };
    }

    function recur(fn) {
        // Each recursion needs to be signed to avoid collisions
        var id = Math.floor(Math.random() * 1000000);
        var signedRecursor = recursor(id);
        var checkResult = checkRecurResult(id);

        return function () {
            var result = apply(signedRecursor, slice(0)(arguments));

            while (checkResult(result)) {
                result = apply(fn, cons(signedRecursor, result.args));
            }

            return result;
        };
    }

    function lastIndexOf(values) {
        return values.length - 1;
    }

    function compose() {
        var fns = slice(0)(arguments).reverse();
        var fn = fns.shift();

        return function () {
            return recur(execCompose)(apply(fn, slice(0)(arguments)), fns);

            function execCompose(recur, result, fns) {
                return j.isNil(fns) ? result : recur(fns[0](result), slice(1)(fns));
            }
        };
    }

    function reverseArgs(fn) {
        return function () {
            return apply(fn, slice(0)(arguments).reverse());
        };
    }

    function buildCurriable(fn, count, args, concat){
        var curryCount = j.eitherNatural(fn.length)(count);
        var initialArgs = j.eitherArray([])(args);

        function curriable (){
            var args = concat(curriable.args, slice(0)(arguments));
            var argsFulfilled = args.length >= curriable.count;

            return argsFulfilled ? apply(curriable.fn, args) : buildCurriable(curriable.fn, curriable.count, args, concat);
        }

        curriable.fn = fn;
        curriable.count = curryCount;
        curriable.args = initialArgs;

        return curriable;
    }

    function curry(fn, count, args){
        return buildCurriable(fn, count, args, concat);
    }

    function rcurry(fn, count, args){
        return buildCurriable(fn, count, args, reverseArgs(concat));
    }

    function directionalPartial(directionalConcat) {
        return function (fn) {
            var args = slice(1)(arguments);

            return function () {
                return apply(fn, directionalConcat(args, slice(0)(arguments)));
            };
        };
    }

    var partial = directionalPartial(concat);

    function repeat(fn) {
        function repeater(recur, count, value) {
            return count < 1 ? value : recur(count - 1, fn(value));
        }

        return curry(partial, 2)(recur(repeater));
    }

    // JFP core functions
    j.always = j.enforce('* => [*] => *', always);
    j.apply = j.enforce('function, array<*> => *', apply);
    j.compose = j.enforce('[function] => function', compose);
    j.concat = curry(j.enforce('concatable, concatable => concatable', concat), 2);
    j.conj = j.enforce('*, array<*> => array<*>', conj);
    j.cons = j.enforce('*, array<*> => array<*>', cons);
    j.curry = j.enforce('function, [int], [array<*>] => [*] => *', curry);
    j.rcurry = j.enforce('function, [int], [array<*>] => [*] => *', rcurry);
    j.identity = j.enforce('* => *', identity);
    j.partial = j.enforce('function, [*] => [*] => *', partial);
    j.recur = j.enforce('function => function', recur);
    j.repeat = j.enforce('function => int => * => *', repeat);
    j.rpartial = j.enforce('function, [*] => [*] => *', directionalPartial(reverseArgs(concat)));
    j.reverseArgs = j.enforce('function => [*] => *', reverseArgs);
    j.slice = j.enforce('int, [int] => variant<array;arguments> => array', slice);
    j.splice = j.enforce('int, [int] => array<*> => array<*>', splice);

})(jfp);