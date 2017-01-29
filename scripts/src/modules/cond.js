(function (j) {
    'use strict';

    function then(fn) {
        var isFunction = j.isFunction(fn);
        var action = isFunction ? fn : j.identity;
        var index = isFunction ? 1 : 0;

        return [action, j.slice(index)(arguments)];
    }

    function when(condArray) {
        var pushToCondArray = j.pushUnsafe(condArray);
        return function (prop, behavior) {
            if (prop) {
                pushToCondArray(behavior);
            }
        };
    }

    function throwOnNil(condFn) {
        var condSource = condFn.toString();

        return function (result) {
            if (j.isNil(result)) {
                throw new Error('All possible conditions were not represented in ' + condSource);
            }
        };
    }

    function handleResult(resultSet, throwOnNil) {
        var result = j.first(resultSet);

        throwOnNil(result);

        var action = result[0];
        var args = result[1];

        return j.apply(action, args);
    }

    function cond(condFn) {
        var condArray = [];
        var _default = true;

        condFn(when(condArray), then, _default);

        return handleResult(condArray, throwOnNil(condFn));
    }

    j.cond = j.enforce('function<function;function;boolean> => *', cond);

})(jfp);
