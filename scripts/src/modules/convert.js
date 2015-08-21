(function(j){
    'use strict';

    function toDec(value){
        return (j.isNumeric(value)) ? parseInt(value, 10) : null;
    }

    j.toDec = toDec;

})(jfp);