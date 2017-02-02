(function (j) {
    'use strict';

    function buildThen(condArray) {
        return function (fn) {
            var result = null;

            if (condArray.length === 0) {
                var isFunction = typeof fn === 'function';

                result = { 
                    action: isFunction ? fn : j.identity, 
                    args: j.slice(isFunction ? 1 : 0)(arguments)
                };
            }

            return result;
        }
    }

    function buildWhen(condArray) {
        var pushToCondArray = j.pushUnsafe(condArray);

        return function (prop, behavior) {
            if (prop && behavior) {
                pushToCondArray(behavior);
            }
        };
    }

    function throwOnNil(condFn) {
        var condSource = condFn.toString();

        return function (resultSet) {
            if (resultSet.length === 0) {
                throw new Error('All possible conditions were not represented in ' + condSource);
            }
        };
    }

    function handleResult(resultSet, throwOnNil) {
        throwOnNil(resultSet);

        var result = resultSet[0];
        
        return j.apply(result.action, result.args);
    }

    function cond(condFn) {
        var condArray = [];

        condFn(buildWhen(condArray), buildThen(condArray), true);

        return handleResult(condArray, throwOnNil(condFn));
    }

    j.cond = j.enforce('function<function;function;boolean> => *', cond);

})(jfp);
