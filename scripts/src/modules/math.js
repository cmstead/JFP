(function (j) {
    'use strict';

    function operation(operator) {
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
            }
        };
    }

    function greater(a, b) { return a > b; }
    function less(a, b) { return a < b; }

    function greaterOrEqual(a, b) { return !(a < b); }
    function lessOrEqual(a, b) { return !(a > b); }

    function curryOperation(operation) {
        return function (a) {
            return function (b) {
                return operation(a, b);
            };
        };
    }

    function operateBy(operator) {
        return function (a) {
            return function (b) {
                return operation(operator)(b, a);
            };
        };
    }

    function range(min, increment) {
        var offset = j.eitherNumber(1)(increment);

        return function (max) {
            var result = [];
            var i = min - offset;

            while (!((i += offset) > max)) {
                result.push(i)
            }

            return result;
        };
    }

    function min (a, b) { return less(a, b) ? a : b; }
    function max (a, b) { return greater(a, b) ? a : b; }

    function between(min, max) {
        return function (value) {
            return !(min > value || value > max);
        };
    }

    function notBetween(min, max) {
        var betweenVals = between(min, max);

        return function (value) {
            return !betweenVals(value);
        };
    }

    // Arithmetic
    j.add = j.enforce('a:number, b:number => sum:number', operation('+'));
    j.divide = j.enforce('a:number, b:number => quotient:number', operation('/'));
    j.mod = j.enforce('a:number, b:number => modulo:number', operation('%'));
    j.multiply = j.enforce('a:number, b:number => product:number', operation('*'));
    j.subtract = j.enforce('a:number, b:number => difference:number', operation('-'));

    j.addBy = j.enforce('a:number => b:number => sum:number', operateBy('+'));
    j.divideBy = j.enforce('b:number => a:number => quotient:number', operateBy('/'));
    j.modBy = j.enforce('b:number => a:number => modulo:number', operateBy('%'));
    j.multiplyBy = j.enforce('a:number => b:number => product:number', operateBy('*'));
    j.subtractBy = j.enforce('b:number => a:number => quotient:number', operateBy('-'));

    j.min = j.enforce('a:number, b:number => minimum:number', min);
    j.max = j.enforce('a:number, b:number => maximum:number', max);

    j.inc = j.enforce('a:int => sum:int', function (a) { return a + 1; });
    j.dec = j.enforce('a:int => difference:int', function (a) { return a - 1; });

    j.range = j.enforce('start:int, increment:[int] => end:int => range:array<int>', range);

    j.gt = j.enforce('a:number => b:number => result:boolean', curryOperation(greater));
    j.geq = j.enforce('a:number => b:number => result:boolean', curryOperation(greaterOrEqual));
    j.lt = j.enforce('a:number => b:number => result:boolean', curryOperation(less));
    j.leq = j.enforce('a:number => b:number => result:boolean', curryOperation(lessOrEqual));

    j.between = j.enforce('min < max :: min:number, max:number => value:number => result:boolean', between);
    j.notBetween = j.enforce('min < max :: min:number, max:number => value:number => result:boolean', notBetween);

})(jfp);