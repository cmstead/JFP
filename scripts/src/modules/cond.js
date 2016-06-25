(function (j) {
    'use strict';

    function then(fn) {
        var action = j.either('function')(j.identity)(fn);
        var index = j.isTypeOf('function')(fn) ? 1 : 0;

        return [action, j.slice(index)(arguments)];
    }

    function when(condArray) {
        return function (prop, behavior) {
            condArray.push([prop, behavior]);
        };
    }

    function throwOnNil(condFn) {
        var condSource = condFn.toString();

        return function (result) {
            if (j.isNil(result)) {
                throw new Error('All possible conditions were not represented in ' + condSourcesT);
            }
        };
    }

    function handleResult(result, throwOnNil) {
        throwOnNil(result);

        var action = result[1][0];
        var args = result[1][1];

        return j.apply(action, args);
    }

    function cond(condFn) {
        var condArray = [];
        var findTrue = j.find(j.compose(Boolean, j.first));

        condFn(when(condArray), then, true);

        return handleResult(findTrue(condArray), throwOnNil(condFn));
    }

    j.cond = j.enforce('function<function;function;boolean> => *', cond);

})(jfp);
