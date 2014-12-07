jfp = (function(){
    'use strict';

    return {};

})();

var j = jfp;

(function(j){

    function shimMode(){
        for(var key in j){
            window[key] = j[key];
        }
    }

    //This provides the option to run this library without the j object declared.
    //This WILL dirty up the window object and potentially collide with reused names.
    //This might change the way you code forever.
    j.shimMode = shimMode;
})();