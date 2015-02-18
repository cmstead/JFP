(function(j){
    'use strict';

    function pick(key, valueMap){
        var pickResult = j.either({}, valueMap)[key];
        return j.isUndefined(pickResult) ? null : pickResult;
    }

    function pluckKeys(keys, valueMap){
        var finalOutput = {},
            sanitizedKeys = j.either([], keys),
            sanitizedValueMap = j.either({}, valueMap);

        function captureValue(key){
            finalOutput[key] = sanitizedValueMap[key];
        }

        j.each(captureValue, sanitizedKeys);

        return finalOutput;
    }

    function pluck(key, valueMap){
        return pluckKeys([key], valueMap);
    }

    function merge(defaultObj, mergeData){
        var finalObj = {},
            key;

        for(key in j.either({}, defaultObj)){
            finalObj[key] = defaultObj[key];
        }

        for(key in j.either({}, mergeData)){
            finalObj[key] = mergeData[key];
        }

        return j.eitherIf(null, finalObj, j.isTruthy(defaultObj));
    }

    j.merge = merge;
    j.pick = pick;
    j.pluck = pluck;
    j.pluckKeys = pluckKeys;

})(jfp);
