var jfp = (function(){
    'use strict';
    
    // function resolveFunction(functionValue){
    //     return typeof functionValue === 'string' ? jfp[functionValue] : functionValue;
    // }
    
    // function curryAlias(){
    //     var args = jfp.slice(0, arguments);

    //     args[0] = resolveFunction(args[0]);
        
    //     return jfp.apply(jfp.curry, args);
    // }
    
    // function pickAlias(key, value){
    //     var cleanKey = key.slice(1);
        
    //     return Boolean(value) ? jfp.pick(cleanKey, value) : jfp.partial(jfp.pick, cleanKey);
    // }
    
    // function chooseResolver(value){
    //     var resolveToPick = typeof value === 'string' && value.charAt(0) === ':';
        
    //     return resolveToPick ? pickAlias : curryAlias;
    // }
    
    // return function(){
    //     var args = jfp.slice(0, arguments),
    //         resolver = chooseResolver(args[0]);
        
    //     return jfp.apply(resolver, args);
    // };
    
})();