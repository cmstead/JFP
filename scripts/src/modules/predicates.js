(function (j) {
    'use strict';

    function equal(a, b) {
        return a === b;
    }

    function not(a) {
        return !a;
    }

    function invert(pred) {
        return j.compose(j.not, pred);
    }



    j.equal = j.enforce('comparable, comparable => boolean', equal);
    j.invert = j.enforce('function => function', invert);
    j.not = j.enforce('boolean => boolean', not);

})(jfp);