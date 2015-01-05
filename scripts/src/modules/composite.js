(function(j){
    'use strict';
    
    //Produces a function that returns f(g(x))
    function compositor(f, g){
        return function(){
            return f(j.apply(g, j.slice(0, arguments)));
        };
    }
    
    function compose(){
        var args = j.slice(0, arguments);
        return (args.length >= 1) ? j.reduce(compositor, args) : j.identity;
    }
    
    function pipeline(){
        return j.apply(compose, j.slice(0, arguments).reverse());
    }

    j.compose = compose;
    j.pipeline = pipeline;

})(jfp);