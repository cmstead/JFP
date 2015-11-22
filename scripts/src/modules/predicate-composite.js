(function (j) {
	'use strict';
	
	//Performs 'and' operation on valueSet
    function ander(a, b){
        return a && b;
    }

    function orer(a, b){
        return a || b;
    }

    function reduceConditions(conditionArgs, operator, initialCondition) {
        return j.pipeline(conditionArgs,
                          j.partial(j.slice, 0),
                          j.partial(j.map, Boolean),
                          j.splitPartial(j.reduce, [operator], [initialCondition]),
                          Boolean);
    }

    function and(a, b){
        return reduceConditions(arguments, ander, true);
    }

    function or(a, b){
        return reduceConditions(arguments, orer, false);
    }

    function xor(a, b){
        var equivalent = Boolean(a) === Boolean(b);
        return or(a, b) && !equivalent;
    }
    
    function cond (conditionPair) {
        var isTruthy = j.compose(j.truthy, j.partial(j.nth, 0)),
            behavior = j.pipeline(arguments,
                                  j.partial(j.slice, 0),
                                  j.partial(j.filter, j.isPair),
                                  j.partial(j.find, isTruthy),
                                  j.partial(j.nth, 1));

        return j.isType('function', behavior) ? behavior() : null;
    }

    function cleanConditionPairs (value, conditionPairs) {
        var error = new Error('Match call does not contain expressions for all condition cases.'),
            notEmpty = j.hasFirst(conditionPairs);

        return cond([j.isUndefined(value), j.always([])],
                    [notEmpty, j.partial(j.conj, 
                                         [j.always(true), function () { throw error; }],
                                         conditionPairs)],
                    ['else', j.partial(j.conj,
                                       [j.always(true), j.always(value)],
                                       conditionPairs)]);
    }

    function matchToCond (value, conditionPair) {
        var condition = j.first(conditionPair),
            result = j.last(conditionPair),
            newPair = [
                j.isType('function', condition) ? condition(value) : j.equal(condition, value),
                j.isType('function', result) ? result : j.always(result)
            ];
        return !j.isPair(conditionPair) ? conditionPair : newPair;
    }

    function match (value, conditionPair) {
        var conditionPairs = j.slice(1, arguments),
            result = j.isUndefined(value) ? null : value;

        return j.pipeline(conditionPairs,
                          j.partial(cleanConditionPairs, result),
                          j.partial(j.map, j.partial(matchToCond, value)),
                          j.partial(j.apply, cond));
    }

    function composePredicate (predicateFn) {
        var args = j.slice(0, arguments),
        
            combinator = match(j.last(args),
                               [j.partial(j.equal, or), j.always(or)],                              
                               [j.always(true), j.always(and)]),
                               
            predicateList = match(j.last(args),
                                  [j.partial(j.equal, or), j.partial(j.dropLast, args)],
                                  [j.partial(j.equal, and), j.partial(j.dropLast, args)],
                                  [j.always(true), j.always(args)]);
        
        return function (value) {
            var executor = j.rpartial(j.execute, value);
            
            return j.pipeline(predicateList,
                              j.partial(j.map, executor),
                              j.partial(j.reduce, combinator),
                              Boolean);
        };
    }

    // Predicate combinators
	j.and = and;
	j.or = or;
	j.xor = xor;

    j.composePredicate = composePredicate;
    j.cond = cond;
    j.match = match;
    
})(jfp);