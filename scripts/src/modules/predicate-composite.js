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
    
    function composePredicate (predicateFn) {
        var predicateList = j.slice(0, arguments),
            combinator = j.last(predicateList),
            lastIsCombinator = combinator === or || combinator === and;
        
        predicateList = lastIsCombinator ? j.dropLast(predicateList) : predicateList;
        combinator = combinator === or ? or : and;
        
        return function (value) {
            var executor = j.rpartial(j.execute, value);
            
            return j.pipeline(predicateList,
                              j.partial(j.map, executor),
                              j.partial(j.reduce, combinator),
                              Boolean);
        };
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
            errorState = [j.always(true), function () { throw error; }],
            emptyState = [j.always(true), j.always(value)];

        return cond([j.isUndefined(value), j.always([])],
                    [j.hasFirst(conditionPairs), j.partial(j.conj, errorState, conditionPairs)],
                    ['else', j.partial(j.conj, emptyState, conditionPairs)]);
    }

    function matchToCond (value, conditionPair) {
        return [conditionPair[0](value), conditionPair[1]];
    }

    function match (value, conditionPair) {
        var conditionPairs = j.slice(1, arguments),
            result = j.isUndefined(value) ? null : value;

        return j.pipeline(conditionPairs,
                          j.partial(cleanConditionPairs, result),
                          j.partial(j.map, j.partial(matchToCond, value)),
                          j.partial(j.apply, cond));
    }

    // Predicate combinators
	j.and = and;
	j.or = or;
	j.xor = xor;

    j.composePredicate = composePredicate;
    j.cond = cond;
    j.match = match;
    
})(jfp);