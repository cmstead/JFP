(function(j){
    'use strict';

    function toValues(valueMap){
        var finalArray = [],
            key;

        j.when(j.isObject(valueMap), function(){
            for(key in valueMap){
                if(valueMap.hasOwnProperty(key) && j.isTruthy(valueMap[key])){
                    finalArray = j.conj(valueMap[key], finalArray);
                }
            }
        });

        return j.either(null, j.when(j.isObject(valueMap), function(){ return finalArray; }));
    }

    function toDec(value){
        return (j.isNumeric(value)) ? parseInt(value, 10) : null;
    }

    j.toDec = toDec;
    j.toValues = toValues;

})(jfp);