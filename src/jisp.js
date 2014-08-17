var JFP,
    j;

(function(){
    'use strict';

    function generalPartial(direction, userFn){
        var appliedArgs = Array.prototype.slice.call(arguments, 2)

        if(typeof userFn !== 'function'){
            throw new TypeError("Expected first argument to be a function but actually got " + typeof userFn);
        }

        return function(){
            var finalArgs = (direction === "left") ?
                appliedArgs.concat(Array.prototype.slice.call(arguments, 0)) :
                Array.prototype.slice.call(arguments, 0).concat(appliedArgs);

            userFn.apply(window, finalArgs);
        }
    }

    function rpartial(){
        var args = Array.prototype.slice.call(arguments, 0);
        return generalPartial.apply(window, ["left"].concat(args));
    }

    function lpartial(userFn){
        var args = Array.prototype.slice.call(arguments, 0);
        return generalPartial.apply(window, ["right"].concat(args));
    }

    function thread(value){
        var userFns = Array.prototype.slice.call(arguments, 1),
            returnedValue = value;

        userFns.forEach(function(userFn){
            returnedValue = userFn(returnedValue);
        });

        return returnedValue;
    }

    function recur(){
        var args = Array.prototype.slice.call(arguments),
            userFn = args.pop();

        userFn.apply(window, args);
    }

    JFP = {
        recur: recur,
        lpartial: lpartial,
        partial: rpartial,
        rpartial: rpartial,
        thread: thread
    };

    j = JFP;
})();