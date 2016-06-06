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

    function setValue(obj) {
        return function (result, key) {
            result[key] = obj[key];
            return result;
        };
    }

    function merge(objA, objB) {
        var newObj = j.foldl(setValue(objA), {})(Object.keys(objA));
        return j.foldl(setValue(objB), newObj)(Object.keys(objB));
    }

    function toArray(obj) {
        return j.recur(convertKeys)([], Object.keys(obj));

        function convertKeys(recur, result, keys) {
            var key = j.first(keys);
            return j.isNil(keys) ? result : recur(j.conj([key, obj[key]], result), j.rest(keys));
        }
    }

    var second = j.nth(1);

    function addTuple(obj, objTuple) {
        if (!j.isNil(objTuple)) {
            obj[j.first(objTuple)] = second(objTuple);
        }

        return obj;
    }

    function toObject(tupleArray) {
        return j.recur(convertTuples)({}, tupleArray);

        function convertTuples(recur, result, objTuples) {
            return j.cond(function (when, then, _default) {
                when(j.isNil(objTuples), then(result));
                when(_default, then(recur, addTuple(result, j.first(objTuples)), j.rest(objTuples)));
            });
        }
    }

    j.pick = j.enforce('string => object => maybe<defined>', pick);
    j.deref = j.enforce('string => object => maybe<defined>', deref);
    j.merge = j.enforce('object, object => object', merge);
    j.toArray = j.enforce('object => array<tuple<objectKey;*>>', toArray);
    j.toObject = j.enforce('array<tuple<objectKey;*>> => object', toObject);

})(jfp);