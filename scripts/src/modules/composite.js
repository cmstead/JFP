(function(j){
    'use strict';

    //This is complicated and I don't expect people to grok it on first read.
    function curry(userFn){
        var args = j.slice(1, arguments),
            argumentCount = j.countArguments(userFn),
            appliedFn = (args.length < argumentCount) ? j.apply(j.partial, j.concat([curry, userFn], args)) : null,
            result = (!!userFn && args.length >= argumentCount) ? j.apply(userFn, args) : null;

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
     * toValues converts an object to an array of values
     * This is necessary for reduce to convert objects into
     * processible arrays in an upcoming version.
     */
    function valueReducer (recur, baseObj, finalList, keyList) {
        finalList.push(baseObj[j.first(keyList)]);
        return keyList.length === 1 ? finalList : recur(baseObj, finalList, j.rest(keyList));
    }
    
    function toValues (baseObj) {
        var baseIsValid = typeof baseObj === 'object';
        return !baseIsValid ? null : j.recur(valueReducer, baseObj, [], Object.keys(baseObj));
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

    function reduce(userFn, values, initialState){
        var appliedReducer = j.partial(reducer, userFn),
            hasInitialState = typeof initialState !== 'undefined',
            
            initialValue = !hasInitialState ? j.first(values) : initialState,
            remainder = !hasInitialState ? j.rest(values) : values;

        return (!!values && values.length > 0) ? j.recur(appliedReducer, initialValue, remainder) : initialValue;
    }

    //Produces a function that returns f(g(x))
    function compositor(f, g){
        var compositeFn = function(){
            return f(j.apply(g, j.slice(0, arguments)));
        };
        
        return typeof g !== 'function' ? f : compositeFn;
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
            copyOkay = j.isType('object', originalValue);
        
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

    j.clone = clone;
    j.compose = compose;
    j.curry = curry;
    j.partialReverse = partialReverse;
    j.pipeline = pipeline;
    j.recur = recur;
    j.reduce = reduce;
    j.toValues = toValues;

})(jfp);
