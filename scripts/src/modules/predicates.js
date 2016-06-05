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

    function and (a, b){
        return Boolean(a && b);
    }
    
    function or (a, b){
        return Boolean(a || b);
    }
    
    function xor (a, b) {
        return Boolean(a ? !b : b);
    }

    var isUndefined = j.isTypeOf('undefined');

    function operationCurry (fn){
        return function (a, b) {
            return isUndefined(b) ? function (c) { return fn(a, c); } : fn(a, b);
        };
    }

    var currySignature = 'comparable, [comparable] => taggedUnion<function<comparable>;boolean>';

    j.invert = j.enforce('function => function', invert);
    j.equal = j.enforce(currySignature, operationCurry(equal));
    j.and = j.enforce(currySignature, operationCurry(and));
    j.or = j.enforce(currySignature, operationCurry(or));
    j.xor = j.enforce(currySignature, operationCurry(xor));
    j.not = j.enforce('comparable => boolean', not);

    j.isNil = j.isTypeOf('nil');
    j.isUndefined = j.isTypeOf('undefined');

})(jfp);