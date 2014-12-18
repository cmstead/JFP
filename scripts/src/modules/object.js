(function(j){
    'use strict';

    function pick(key, valueMap){
        return j.either(null, j.either({}, valueMap)[key]);
    }

    function pluckKeys(keys, valueMap){
        var finalOutput = {},
            sanitizedKeys = j.either([], keys),
            sanitizedValueMap = j.either({}, valueMap);

        function captureValue(key){
            if(sanitizedValueMap[key]){
                finalOutput[key] = sanitizedValueMap[key];
            }
        }

        j.each(captureValue, sanitizedKeys);

        return finalOutput;
    }

    function pluck(key, valueMap){
        return pluckKeys([key], valueMap);
    }

    j.pick = pick;
    j.pluck = pluck;
    j.pluckKeys = pluckKeys;

})(jfp);