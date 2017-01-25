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

    function greaterOrEqual(a, b) { return !less(a, b); }
    function lessOrEqual(a, b) { return !greater(a, b); }

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

            for (var i = min; i <= max; i += offset) {
                result.push(i)
            }

            return result;
        };
    }

    function extremum(comparator) {
        return function (a, b) {
            return comparator(a, b) ? a : b;
        };
    }

    function between(min, max) {
        if (min >= max) {
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

    j.addBy = j.enforce('number => number => number', operateBy('+'));
    j.divideBy = j.enforce('number => number => number', operateBy('/'));
    j.modBy = j.enforce('number => number => number', operateBy('%'));
    j.multiplyBy = j.enforce('number => number => number', operateBy('*'));
    j.subtractBy = j.enforce('number => number => number', operateBy('-'));

    j.min = j.enforce('number, number => number', extremum(less));
    j.max = j.enforce('number, number => number', extremum(greater));

    j.inc = j.enforce('int => int', function (a) { return a + 1; });
    j.dec = j.enforce('int => int', function (a) { return a - 1; });

    j.range = j.enforce('int, [int] => int => array<int>', range);

    j.gt = j.enforce('number => number => boolean', curryOperation(greater));
    j.geq = j.enforce('number => number => boolean', curryOperation(greaterOrEqual));
    j.lt = j.enforce('number => number => boolean', curryOperation(less));
    j.leq = j.enforce('number => number => boolean', curryOperation(lessOrEqual));
    j.between = j.enforce('number, number => number => boolean', between);

})(jfp);