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
    
    // Predicate combinators
	j.and = and;
	j.or = or;
	j.xor = xor;

    j.composePredicate = composePredicate;
    
})(jfp);