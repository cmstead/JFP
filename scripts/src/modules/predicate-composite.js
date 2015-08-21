(function (j) {
	'use strict';
	
	//Performs 'and' operation on valueSet
    function ander(a, b){
        return a && b;
    }

    function orer(a, b){
        return a || b;
    }

    function reduceConditions(conditionArgs, operator, initialCondition){
        var args = j.map(Boolean, j.slice(0, conditionArgs));
        return Boolean(j.reduce(operator, args, initialCondition));
    }

    function and(a, b){
        return reduceConditions(arguments, ander, true);
    }

    function or(a, b){
        return reduceConditions(arguments, orer, false);
    }

    function xor(a, b){
        var equivalent = Boolean(a) === Boolean(b);
        return or(a, b) && j.not(equivalent);
    }

	j.and = and;
	j.or = or;
	j.xor = xor;

})(jfp);