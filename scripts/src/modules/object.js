(function(j){
    'use strict';

    function pick(key, valueMap){
        var pickResult = j.either({}, valueMap)[key];
        return j.isUndefined(pickResult) ? null : pickResult;
    }

    function getKeys (obj) {
        return Object.keys(j.either({}, obj, 'object'));
    }

    function mergeValue (dataObj, mergedObj, key) {
        mergedObj[key] = dataObj[key];
        return mergedObj;
    }

    function merge(baseObj, mergeData){
        var finalObj = null;
        
        if (j.maybe(baseObj) !== null) {
            finalObj = getKeys(baseObj).reduce(j.partial(mergeValue, baseObj), {});
            finalObj = getKeys(mergeData).reduce(j.partial(mergeValue, mergeData), finalObj);
        }

        return finalObj;
    }

    j.getKeys = getKeys;
    j.merge = merge;
    j.pick = pick;

})(jfp);
