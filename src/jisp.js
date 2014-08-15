var Jisp;

(function(){
    'use strict';

    function partial(userFn){
        var appliedArgs = Array.prototype.slice.call(arguments, 1)

        if(typeof userFn !== 'function'){
            throw new TypeError("Expected first argument to be a function but actually got " + typeof userFn);
        }

        return function(){
            var finalArgs = appliedArgs.concat(Array.prototype.slice.call(arguments, 0));
            userFn.apply(window, finalArgs);
        }
    }

    Jisp = {
        partial: partial
    };

})();