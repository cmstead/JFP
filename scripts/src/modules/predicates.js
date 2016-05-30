(function (j) {
    'use strict';
    
    function equal (a, b){
        return a === b;
    }
    
    function not (a) {
        return !a;
    }
    
    j.equal = j.enforce('comparable, comparable => boolean', equal);
    j.not = j.enforce('boolean => boolean', not);
    
})(jfp);