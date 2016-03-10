(function (j) {
    'use strict';

    function throwIfNotType(type, value) {
        if (!j.isType(type, value)) {
            throw new TypeError('Expected value of type ' + type + ' but got ' + j.getType(value) + '.');
        }
    }

    function throwIfBadFunctionStr(functionStr) {
        var functionPattern = /^function(\s[^(]+)?\s*\([^)]*\)\s*\{(\s*.*)*\}$/m;
        
        if (functionStr.match(functionPattern) === null) {
            throw new Error('Function.toString must return a function string.');
        }
    }

    function enclose(userFn, environment) {
        var functionStr = userFn.toString();
        
        throwIfNotType('function', userFn);
        throwIfBadFunctionStr(functionStr);

        var enclosingFunction = 'return ' + functionStr + ';',
            enclosingFn = new Function(j.getKeys(environment), enclosingFunction);

        return j.apply(enclosingFn, j.toValues(environment));
    }

    //This is complicated and I don't expect people to grok it on first read.
    function curry(userFn) {
        var args = j.slice(1, arguments),
            done = args.length >= j.countArguments(userFn),
            appliedFn = !done ? j.apply(j.partial, j.concat([curry, userFn], args)) : null,
            result = Boolean(userFn) && done ? j.apply(userFn, args) : null;

        return j.either(appliedFn, result);
    }

    //zOMG! TAIL OPTIMIZED RECURSION
    function RecursionIntermediateValue (args) {
        this.args = args;
    }
    
    RecursionIntermediateValue.prototype = {
        valueOf: function () {
            return this.args;
        }
    };

    function recursionIVFactory () {
        var args = j.slice(0, arguments);
        return new RecursionIntermediateValue(args);
    }

    //Tail optimization with managed recursion is slightly complicated.
    //Please don't muck with this unless you understand what is happening.
    function recur(userFn) {
        var recursingFn = j.either(j.identity, userFn, 'function');
        var callResult = j.apply(recursionIVFactory, j.slice(1, arguments));

        while(callResult instanceof RecursionIntermediateValue) {
            callResult = j.apply(recursingFn, j.cons(recursionIVFactory, callResult.valueOf()));
        }

        return callResult;
    }

    function buildRecursionEnvironment (environment) {
        var baseEnvironment = { j: jfp, jfp: jfp, recur: recursionIVFactory };
        return j.merge(baseEnvironment, j.either({}, environment, 'object'));
    }

    function recursible (userFn, environment){
        var recursibleFn = enclose(userFn, buildRecursionEnvironment(environment));
        
        return function () {
            var callResult = j.apply(recursionIVFactory, j.slice(0, arguments));
            
            while(callResult instanceof RecursionIntermediateValue) {
                callResult = j.apply(recursibleFn, callResult.valueOf());
            }
            
            return callResult;
        };
    }

	/*
     * Reduce uses tail-optimized (while-trampolined, fully returning) recursion to resolve reductions.
     * Reducer is a pure function for handling a single reduction step.
     * Reduce manages the setup and recursion execution.
     */
    function reducer(userFn, recur, reduction, collection) {
        return collection.length === 0 ?
            reduction :
            recur(userFn(reduction, j.first(collection)),
                j.rest(collection));
    }

    function reduce(userFn, values) {
        var hasInitialState = !j.isUndefined(arguments[2]),
            initialValue = !hasInitialState ? j.first(values) : arguments[2],
            remainder = !hasInitialState ? j.rest(values) : values;

        return (Boolean(values) && values.length > 0) ?
            j.recur(j.partial(reducer, userFn), initialValue, remainder) :
            initialValue;
    }

    //Produces a function that returns f(g(x))
    function compositor(f, g) {
        var clean = j.splitPartial(j.either, [j.identity], ['function']);

        return function () {
            return clean(f)(j.apply(clean(g), j.slice(0, arguments)));
        };
    }

    function compose() {
        return reduce(compositor, j.slice(0, arguments), j.identity);
    }

    function pipeline(value) {
        return j.apply(compose, j.slice(1, arguments).reverse())(value);
    }

    function partialReverse() {
        return j.apply(j.compose(j.reverseArgs, j.partial),
            j.slice(0, arguments));
    }

    function clone(originalValue, depth) {
        var depthOkay = j.isUndefined(depth) || j.geq(depth, 0),
            copyOkay = j.isType('object', originalValue) || j.isType('array', originalValue);

        function copy() {
            var keys = Object.keys(originalValue),
                container = j.isArray(originalValue) ? [] : {};

            j.each(function (key) {
                var newDepth = j.isNumber(depth) ? depth - 1 : undefined;

                try {
                    container[key] = clone(originalValue[key], newDepth);
                } catch (err) {
                    throw new RangeError('Object contains circular reference or is too deep to clone.');
                }

            }, keys);

            return container;
        }

        return copyOkay && depthOkay ? copy() : originalValue;
    }

    function maybeType(typeString) {
        return j.curry(function (value) {
            return j.maybe(value, typeString);
        }).apply(j, j.slice(1, arguments));
    }

    function eitherType(typeString) {
        return j.curry(function (defaultValue, optionValue) {
            return j.either(defaultValue, optionValue, typeString);
        }).apply(j, j.slice(1, arguments));
    }

    function timesRecursor(recur, count, userFn, accumulator) {
        return j.isZero(count) ? accumulator : recur(count - 1, userFn, userFn(accumulator));
    }

    function times(count, userFn) {
        var accumulator = arguments[2];
        return j.recur(timesRecursor, count, userFn, accumulator);
    }

    function repeatStepFactory(value) {
        return function (accumulator) {
            return accumulator + value;
        };
    }

    function repeat(count, value) {
        return times(count, repeatStepFactory(value), '');
    }


    j.clone = clone;
    j.compose = compose;
    j.curry = curry;
    j.eitherType = eitherType;
    j.enclose = enclose;
    j.maybeType = maybeType;
    j.partialReverse = partialReverse;
    j.pipeline = pipeline;
    j.rcompose = j.reverseArgs(compose);
    j.recur = recur;
    j.recursible = recursible;
    j.reduce = reduce;
    j.repeat = repeat;
    j.times = times;

})(jfp);
