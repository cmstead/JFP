(function(j){
    'use strict';

    function toValues(valueMap){
        var finalArray = (j.isObject(valueMap)) ? [] : null,
            key;

        if(!!finalArray){
            for(key in valueMap){
                if(valueMap.hasOwnProperty(key) && !!valueMap[key]){
                    finalArray.push(valueMap[key]);
                }
            }
        }

        return finalArray;
    }

    j.toValues = toValues;

})(jfp);