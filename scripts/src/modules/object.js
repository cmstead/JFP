(function (j) {
    'use strict';

    function pick(key) {
        return function (obj) {
            return j.isDefined(obj) ? j.maybeDefined(obj[key]) : null;
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
            var result = obj;

            for(var i = 0; i < keyTokens.length && result !== null; i++){
                result = pick(keyTokens[i])(result);
            }

            return result;
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
        var keys = Object.keys(obj);
        var result = [];

        for(var i = 0; i < keys.length; i++) {
            var key = keys[i];
            result.push([key, obj[key]]);
        }

        return result;
    }

    function toValues(obj) {
        var keys = Object.keys(obj);
        var result = [];

        for(var i = 0; i < keys.length; i++) {
            result.push(obj[keys[i]]);
        }

        return result;
    }

    function addProperty(obj, propertyPair) {
        obj[propertyPair[0]] = propertyPair[1];
        return obj;
    }

    function toObject(tupleArray) {
        var result = {};

        for(var i = 0; i < tupleArray.length; i++) {
            var tuple = tupleArray[i];
            result[tuple[0]] = tuple[1];
        }

        return result;
    }

    function clone(obj) {
        var result = j.isArray(obj) ? [] : {};
        var keys = Object.keys(obj);

        try {
            return j.foldl(copyKeys, result)(keys);
        } catch (e) {
            throw new Error('Object is circular or too deep to clone.');
        }

        function copyKeys(result, key) {
            var value = obj[key];
            result[key] = j.isObject(value) ? clone(value) : value;
            return result;
        }
    }

    j.clone = j.enforce('object => object', clone);
    j.deref = j.enforce('string => * => maybe<defined>', deref);
    j.merge = j.enforce('object, object => object', merge);
    j.mergeToUnsafe = j.enforce('object => object => object', mergeToUnsafe);
    j.pick = j.enforce('string => * => maybe<defined>', pick);
    j.shallowClone = j.enforce('object => object => object', shallowClone);
    j.toArray = j.enforce('object => array<tuple<objectKey;*>>', toArray);
    j.toObject = j.enforce('array<tuple<objectKey;*>> => object', toObject);
    j.toValues = j.enforce('object => array<*>', toValues);

})(jfp);
