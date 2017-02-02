(function (j) {
    'use strict';

    function pickByObj(obj) {
        return function (key) {
            return pick(key)(obj);
        };
    }

    function deref(key) {
        var tokens = key.split('.');

        return function (obj) {
            var result = obj;
            var tokenLen = tokens.length;

            for (var i = 0; i < tokenLen && result !== null; i++) {
                try {
                    result = result[tokens[i]];
                } catch (e) {
                    return null;
                }
            }

            return j.maybeDefined(result);
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
            var keys = Object.keys(objB);

            for(var i = 0; i < keys.length; i++) {
                objA[keys[i]] = objB[keys[i]];
            }

            return objA;
        };
    }

    function shallowClone(obj) {
        return mergeToUnsafe(j.isArray(obj) ? [] : {})(obj);
    }

    function merge(objA, objB) {
        return mergeToUnsafe(shallowClone(objA))(objB);
    }

    function getKeys(obj) {
        return Object.keys(obj);
    }

    function toArray(obj) {
        return j.map(function (key) {
            return [key, obj[key]];
        })(getKeys(obj));
    }

    function toValues(obj) {
        var keys = getKeys(obj);
        var result = [];

        for (var i = 0; i < keys.length; i++) {
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

        for (var i = 0; i < tupleArray.length; i++) {
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
    j.shallowClone = j.enforce('object => object => object', shallowClone);
    j.toArray = j.enforce('object => array<tuple<objectKey;*>>', toArray);
    j.toObject = j.enforce('array<tuple<objectKey;*>> => object', toObject);
    j.toValues = j.enforce('object => array<*>', toValues);

})(jfp);
