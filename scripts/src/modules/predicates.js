(function (j) {
    'use strict';

    function not(a) {
        return !a;
    }

    function invert(pred) {
        return j.compose(j.not, pred);
    }

    function compare (operator){
        return function (a) {
            return function (b) {
                switch(operator) {
                    case '===':
                        return a === b;
                    case '&&':
                        return Boolean(a && b);
                    case '||':
                        return Boolean(a || b);
                    case 'xor':
                        return Boolean(a ? !b : b);
                }
            };
        };
    }

    var currySignature = 'comparable => comparable => boolean';

    j.invert = j.enforce('function => function', invert);
    j.not = j.enforce('comparable => boolean', not);

    j.equal = j.enforce(currySignature, compare('==='));
    j.and = j.enforce(currySignature,compare('&&'));
    j.or = j.enforce(currySignature, compare('||'));
    j.xor = j.enforce(currySignature, compare('xor'));

})(jfp);