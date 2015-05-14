function jfp(a, b, c){
    'use strict';
    
    var args = Array.prototype.slice.call(arguments);
    
    return jfp.apply(jfp.curry, args);
}