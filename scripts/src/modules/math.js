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

    function compare (operator){
        return function (a) {
            return function (b) {
                switch(operator) {
                    case '>':
                        return a > b;
                    case '<':
                        return a < b;
                    case '>=':
                        return a >= b;
                    case '<=':
                        return a <= b;
                }
            };
        };
    }

    function operationCurry(operation) {
        return function (a) {
            var b = arguments[1];
            return isUndefined(b) ? function (b) { return operation(a, b); } : operation(a, b);
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

    function equal(a, b) {
        return a === b;
    }

    function between (min, max){
        if(min >= max) {
            throw new Error('Invalid range, ' + min + ' is not less than ' + max);
        }
        
        return function (value) {
            return min <= value && value <= max;
        };
    }

    // Arithmetic
    j.add = j.enforce('number, number => number', operation('+'));
    j.divide = j.enforce('number, number => number', operation('/'));
    j.mod = j.enforce('number, number => number', operation('%'));
    j.multiply = j.enforce('number, number => number', operation('*'));
    j.subtract = j.enforce('number, number => number', operation('-'));

    j.addBy = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(j.add));
    j.divideBy = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(j.reverseArgs(j.divide)));
    j.modBy = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(j.reverseArgs(j.mod)));
    j.multiplyBy = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(j.multiply));
    j.subtractBy = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(j.reverseArgs(j.subtract)));

    j.min = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(min));
    j.max = j.enforce('[number], [number] => taggedUnion<function;number>', operationCurry(max));

    j.inc = j.enforce('[int] => int', operationCurry(j.add)(1));
    j.dec = j.enforce('[int] => int', operationCurry(j.add)(-1));

    j.range = j.enforce('int, [int] => int => array<int>', range);
    
    j.gt = j.enforce('number => number => boolean', compare('>'));
    j.geq = j.enforce('number => number => boolean', compare('>='));
    j.lt = j.enforce('number => number => boolean', compare('<'));
    j.leq = j.enforce('number => number => boolean', compare('<='));
    j.between = j.enforce('number, number => number => boolean', between);

})(jfp);