(function (j) {
    'use strict';

    function buildThen(condResult) {
        return function (fn) {
            var args = arguments;

            return function () {
                var isFunction = typeof fn === 'function';
                
                condResult.action = isFunction ? fn : j.identity;
                condResult.args = j.slice(isFunction ? 1 : 0)(args);
            };
        }
    }

    function buildWhen(condResult) {
        return function (prop, captureBehavior) {
            if (condResult.action === null && prop) {
                captureBehavior();
            }
        };
    }

    function cond(condFn) {
        var condResult = {
            action: null,
            args: []
        };

        condFn(buildWhen(condResult), buildThen(condResult), true);

        if (condResult.action === null) {
            throw new Error('All possible conditions were not represented in ' + condFn.toString());
        }

        return j.apply(condResult.action, condResult.args);
    }

    j.cond = j.enforce('function<function;function;boolean> => *', cond);

})(jfp);
