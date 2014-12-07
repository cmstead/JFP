(function(j, window){

    function shimMode(){
        for(var key in j){
            window[key] = j[key];
        }
    }

    //This provides the option to run this library without the j object declared.
    //This WILL dirty up the window object and potentially collide with reused names.
    //This might change the way you code forever.
    if(typeof window !== 'undefined'){
        j.shimMode = shimMode;
    }

    if(typeof module !== 'undefined'){
        module.exports = j;
    }

})(jfp, window);

var j = jfp;