(function(j){
    'use strict';

    //This is complicated and I don't expect people to grok it on first read.
    function curry(userFn){
        var args = j.slice(1, arguments),
            done = args.length >= j.countArguments(userFn),
            appliedFn = !done ? j.apply(j.partial, j.concat([curry, userFn], args)) : null,
            result = Boolean(userFn) && done ? j.apply(userFn, args) : null;

        return j.either(appliedFn, result);
    }

    //zOMG! TAIL OPTIMIZED RECURSION
    function recursor(recurFn){
        var args = j.slice(1, arguments);

        //This is to make the returned function distinct and identifiable.
        return function recursorFn(localRecursor){
            return j.apply(recurFn, j.concat([localRecursor], args));
        };
    }

    function verifyRecurValue(recurValue){
        return typeof recurValue === 'function' &&
            recurValue.toString().match('recursorFn');
    }

    //Tail optimization with managed recursion is really complicated.
    //Please don't muck with this unless you TRULY understand what is happening.
    function recur(userFn){
        var recursingFn = j.either(j.identity, userFn, 'function'),
            localRecursor = j.partial(recursor, recursingFn),
            recurValue = j.apply(localRecursor, j.slice(1, arguments));

        while(verifyRecurValue(recurValue = recurValue(localRecursor)) && recursingFn !== j.identity);

        return recurValue;
    }

	/*
     * Reduce uses tail-optimized (while-trampolined, fully returning) recursion to resolve reductions.
     * Reducer is a pure function for handling a single reduction step.
     * Reduce manages the setup and recursion execution.
     */
    function reducer(userFn, recur, reduction, collection){
        return collection.length === 0 ?
                    reduction :
                    recur(userFn(reduction, j.first(collection)),
                          j.rest(collection));
    }

    function reduce(userFn, values){
        var hasInitialState = !j.isUndefined(arguments[2]),
            initialValue = !hasInitialState ? j.first(values) : arguments[2],
            remainder = !hasInitialState ? j.rest(values) : values;

        return (Boolean(values) && values.length > 0) ?
                j.recur(j.partial(reducer, userFn), initialValue, remainder) :
                initialValue;
    }

    //Produces a function that returns f(g(x))
    function compositor(f, g){
        var clean = j.splitPartial(j.either, [j.identity], ['function']);
            
        return function () {
            return clean(f)(j.apply(clean(g), j.slice(0, arguments)));
        };
    }

    function compose(){
        return reduce(compositor, j.slice(0, arguments), j.identity);
    }

    function pipeline(value){
        return j.apply(compose, j.slice(1, arguments).reverse())(value);
    }

    function partialReverse(){
        return j.apply(j.compose(j.reverseArgs, j.partial),
                       j.slice(0, arguments));
    }

    function clone (originalValue, depth) {
        var depthOkay = j.isUndefined(depth) || j.geq(depth, 0),
            copyOkay = j.isType('object', originalValue) || j.isType('array', originalValue);
        
        function copy () {
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

    function maybeType (typeString) {
        return j.curry(function (value) {
            return j.maybe(value, typeString);
        }).apply(j, j.slice(1, arguments));
    }
    
    function eitherType (typeString) {
        return j.curry(function (defaultValue, optionValue) {
            return j.either(defaultValue, optionValue, typeString);
        }).apply(j, j.slice(1, arguments));
    }
    
    j.clone = clone;
    j.compose = compose;
    j.curry = curry;
    j.eitherType = eitherType;
    j.maybeType = maybeType;
    j.partialReverse = partialReverse;
    j.pipeline = pipeline;
    j.recur = recur;
    j.reduce = reduce;

})(jfp);
