(function (j) {
    'use strict';

    var isUndefined = j.isTypeOf('undefined');

    function operation (operator){
        return function (a, b) {
            switch (operator) {
                case '+':
                    return a + b;
                case '-':
                    return a - b;
                case '*':
                    return a * b;
                case '/':
                    return a / b;
                case '%':
                    return a % b;
                default:
                    return new Error('Bad operator');
            }
        };
    }

    function reverse (fn){
        return function (a, b) {
            return fn(b, a);
        };
    }

    function curry(operation) {
        return function (a) {
            var b = arguments[1];
            return isUndefined(b) ? j.partial(operation, a) : operation(a, b);
        };
    }

    function range(min, increment) {
        var offset = isUndefined(increment) ? 1 : increment;
        
        return function (max) {
            return j.recur(buildRange)(min, []);

            function buildRange(recur, value, output) {
                return value > max ? output : recur(value + offset, j.conj(value, output));
            }
        };
    }

    function max (a, b){
        return a > b ? a : b;
    }
    
    function min (a, b){
        return a < b ? a : b;
    }

    // Arithmetic
    j.add = j.enforce('number, number => number', operation('+'));
    j.divide = j.enforce('number, number => number', operation('/'));
    j.mod = j.enforce('number, number => number', operation('%'));
    j.multiply = j.enforce('number, number => number', operation('*'));
    j.subtract = j.enforce('number, number => number', operation('-'));

    j.addBy = j.enforce('number => number => number', curry(j.add));
    j.divideBy = j.enforce('number => number => number', curry(reverse(j.divide)));
    j.modBy = j.enforce('number => number => number', curry(reverse(j.mod)));
    j.multiplyBy = j.enforce('number => number => number', curry(j.multiply));
    j.subtractBy = j.enforce('number => number => number', curry(reverse(j.subtract)));

    j.range = j.enforce('int, [int] => int => array<int>', range);

})(jfp);