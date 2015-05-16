var jfp = (function(){
    'use strict';
    
    function resolveFunction(functionValue){
        return typeof functionValue === 'string' ? jfp[functionValue] : functionValue;
    }
    
    return function(){
        var args = jfp.slice(0, arguments);
        
        args[0] = resolveFunction(args[0]);
        
        return jfp.apply(jfp.curry, args);
    };
    
})();