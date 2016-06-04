(function (j) {
    'use strict';

    var isNil = j.isTypeOf('nil');
    var maybe = j.maybe('defined');

    function pick(key) {
        return function (obj) {
            return maybe(obj[key]);
        };
    }

    function deref(key) {
        var keyTokens = key.split('.');
        
        return function (obj) {
            return j.recur(derefStep)(obj, keyTokens);

            function derefStep(recur, obj, keyTokens) {
                var key = j.first(keyTokens);

                return isNil(keyTokens) ? obj : recur(pick(key)(obj), j.rest(keyTokens));
            }
        };
    }

    j.pick = j.enforce('string => object => maybe<defined>', pick);
    j.deref = j.enforce('string => object => maybe<defined>', deref);

})(jfp);