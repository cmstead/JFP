(function(j){
    'use strict';
    
    //Produces a function that returns f(g(x))
    function compositor(f, g){
        return function(){
            return f(j.apply(j.slice(0, arguments), g));
        };
    }
    
    function compose(){
        var args = j.slice(0, arguments);
        return (args.length >= 1) ? j.reduce(compositor, args) : j.identity;
    }

    j.compose = compose;

})(jfp);