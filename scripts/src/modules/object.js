(function (j) {
    'use strict';

    var eitherNotNull = j.either('notNull')({});
    var eitherDefined = j.either('defined')(null);
    var eitherReferencible = j.either('referencible')({});

    function pick(key) {
        return function (obj) {
            return eitherDefined(eitherNotNull(obj)[key]);
        };
    }

    function pickByObj (obj){
        return function (key){
            return pick(key)(obj);
        };
    }

    function deref(key) {
        var keyTokens = key.split('.');

        return function (obj) {
            return j.foldl(pickKey, obj)(keyTokens);

            function pickKey(result, key) {
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

    function merge(objA, objB) {
        var newObj = j.foldl(setValue(objA), {})(Object.keys(objA));
        return j.foldl(setValue(objB), newObj)(Object.keys(objB));
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

    var second = j.nth(1);

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
    j.toArray = j.enforce('object => array<tuple<objectKey;*>>', toArray);
    j.toObject = j.enforce('array<tuple<objectKey;*>> => object', toObject);
    j.toValues = j.enforce('object => array<*>', toValues);

})(jfp);