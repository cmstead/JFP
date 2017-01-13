(function (j) {
    'use strict';

    function pick(key) {
        return function (obj) {
            return j.maybeDefined(j.eitherReferencible({})(obj)[key]);
        };
    }

    function pickByObj(obj) {
        return function (key) {
            return pick(key)(obj);
        };
    }

    function deref(key) {
        var keyTokens = key.split('.');

        return function (obj) {
            return j.foldl(getNext, obj)(keyTokens);

            function getNext(result, key) {
                return pick(key)(result);
            }
        };
    }

    function setValue(obj) {
        return function (result, key) {
            result[key] = obj[key];
            return result;
        };
    }

    function mergeToUnsafe(objA) {
        return function (objB) {
            return j.foldl(setValue(objB), objA)(Object.keys(objB));
        };
    }

    function shallowClone(obj) {
        var cloneTo = j.isArray(obj) ? [] : {};
        return mergeToUnsafe(cloneTo)(obj);
    }

    function merge(objA, objB) {
        return mergeToUnsafe(shallowClone(objA))(objB);
    }

    function toArray(obj) {
        var pickKey = pickByObj(obj);
        return j.map(captureTuple)(Object.keys(obj));

        function captureTuple(key) {
            return [key, pickKey(key)];
        }
    }

    function toValues(obj) {
        return j.map(pickByObj(obj))(Object.keys(obj));
    }

    function addProperty(obj, propertyPair) {
        obj[propertyPair[0]] = propertyPair[1];
        return obj;
    }

    function toObject(tupleArray) {
        return j.foldl(addProperty, {})(tupleArray);
    }

    j.pick = j.enforce('string => * => maybe<defined>', pick);
    j.deref = j.enforce('string => * => maybe<defined>', deref);
    j.merge = j.enforce('object, object => object', merge);
    j.mergeToUnsafe = j.enforce('object => object => object', mergeToUnsafe);
    j.shallowClone = j.enforce('object => object => object', shallowClone);
    j.toArray = j.enforce('object => array<tuple<objectKey;*>>', toArray);
    j.toObject = j.enforce('array<tuple<objectKey;*>> => object', toObject);
    j.toValues = j.enforce('object => array<*>', toValues);

})(jfp);