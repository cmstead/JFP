(function (j) {
    'use strict';
    
    var isFunction = j.isTypeOf('function');
    
    function then (fn){
        var index = isFunction(fn) ? 1 : 0;
        var action = index === 1 ? fn : j.identity;
        
        return [action, j.slice(index)(arguments)];
    }
    
    function when (condArray){
        return function (prop, behavior) {
            condArray.push([prop, behavior]);
        };
    }
    
    function throwOnNil (result, condFn){
        if(j.isNil(result)) {
            throw new Error('All possible conditions were not represented in ' + condFn.toString());
        }
    }

    function callBehavior (behavior){
        var fn = behavior[0];
        var args = behavior[1];
        
        return j.apply(fn, args);
    }
    
    function cond (condFn){
        var condArray = [];
        
        condFn(when(condArray), then, true);
                
        var result = j.find(j.compose(Boolean, j.first))(condArray);
        var behavior = result[1];
        
        throwOnNil(result, condFn);
        
        return callBehavior(behavior);
    }
    
    j.cond = j.enforce('function<function;function;boolean> => *', cond);
    
})(jfp);
