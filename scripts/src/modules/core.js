(function (j) {
    'use strict';

    var isUndefined = j.isTypeOf('undefined');

    function identity(value) {
        return value;
    }

    function always(value) {
        return identity.bind(null, value);
    }

    function either(typeStr) {
        var checkType = j.isTypeOf(typeStr);

        return function (defaultValue) {
            return function (value) {
                return checkType(value) ? value : defaultValue;
            };
        };
    }

    function maybe(typeStr) {
        return either(typeStr)(j.nil);
    }

    function concat(valuesa, valuesb) {
        var result = valuesa.slice(0);

        for (var i = 0; i < valuesb.length; i++) {
            result.push(valuesb[i]);
        }

        return result;
    }

    function cons(value, values) {
        return isUndefined(value) ? values : concat([value], values);
    }

    function conj(value, values) {
        return isUndefined(value) ? values : concat(values, [value]);
    }

    function slice(start, end) {
        return function (valueSet) {
            return Array.prototype.slice.apply(valueSet, cons(start, cons(end, j.nil)));
        };
    }

    function apply(fn, args) {
        return fn.apply(null, args);
    }

    function RecurObj(id, args) {
        this.id = id;
        this.args = args;
    }

    function recursor (id){
        return function () {
            return new RecurObj(id, slice(0)(arguments));
        };
    }

    function recur(fn) {
        // Each recursion needs to be signed to avoid collisions
        var id = Math.floor(Math.random() * 1000000);
        var signedRecursor = recursor(id);
        
        return function () {
            var result = apply(signedRecursor, slice(0)(arguments));

            while (result instanceof RecurObj && result.id === id) {
                result = apply(fn, cons(signedRecursor, result.args));
            }

            return result;
        };
    }

    function compose() {
        var fns = slice(0)(arguments).reverse();
        var fn = fns.shift();
        var isNil = j.isTypeOf('nil');

        return function () {
            return recur(execCompose)(apply(fn, slice(0)(arguments)), fns);

            function execCompose(recur, result, fns) {
                return isNil(fns) ? result : recur(fns[0](result), slice(1)(fns));
            }
        };
    }

    function reverseArgs(fn) {
        return function () {
            return apply(fn, slice(0)(arguments).reverse());
        };
    }

    var maybeArray = maybe('array');
    var eitherInt = either('int');

    function attachCurryData (curriable, fn, count, args){
        Object.defineProperty(curriable, 'fnLength', {
            value: eitherInt(fn.length)(count),
            writeable: false
        });
        
        curriable.fn = fn;
        curriable.args = maybeArray(args);

        return curriable;
    }

    function directionalCurry (directionalConcat) {
        var curry = function (fn, count, args) {
            
            var curriable = function () {
                var args = directionalConcat(curriable.args, slice(0)(arguments));
                var done = curriable.fnLength <= args.length;

                return done ? apply(curriable.fn, args) : curry(fn, curriable.fnLength, args);
            };

            return attachCurryData(curriable, fn, count, args);
        };
        
        return curry;
    }

    function directionalPartial (directionalConcat){
        return function (fn) {
            var args = slice(1)(arguments);

            return function () {
                return apply(fn, directionalConcat(args, slice(0)(arguments)));
            };        
        };
    }

    // JFP core functions
    j.always = j.enforce('* => [*] => *', always);
    j.apply = j.enforce('function, array<*> => *', apply);
    j.compose = j.enforce('[function] => function', compose);
    j.concat = j.enforce('array<*>, array<*> => array<*>', concat);
    j.conj = j.enforce('*, array<*> => array<*>', conj);
    j.cons = j.enforce('*, array<*> => array<*>', cons);
    j.curry = j.enforce('function, [int], [array<*>] => [*] => *', directionalCurry(concat));
    j.rcurry = j.enforce('function, [int], [array<*>] => [*] => *', directionalCurry(reverseArgs(concat)));
    j.either = j.enforce('string => * => * => *', either);
    j.identity = j.enforce('* => *', identity);
    j.maybe = j.enforce('string => * => maybe<defined>', maybe);
    j.partial = j.enforce('function, [*] => [*] => *', directionalPartial(concat));
    j.recur = j.enforce('function => function', recur);
    j.rpartial = j.enforce('function, [*] => [*] => *', directionalPartial(reverseArgs(concat)));
    j.reverseArgs = j.enforce('function => [*] => *', reverseArgs);
    j.slice = j.enforce('int, [int] => taggedUnion<array<*>;arguments> => array<*>', slice);

})(jfp);