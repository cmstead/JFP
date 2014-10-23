var JFP,
    j;

(function(){
    'use strict';

    //Internal functions
    function generalPartial(direction, userFn){
        var appliedArgs = Array.prototype.slice.call(arguments, 2)

        return function(){
            var finalArgs = (direction === "left") ?
                appliedArgs.concat(Array.prototype.slice.call(arguments, 0)) :
                Array.prototype.slice.call(arguments, 0).concat(appliedArgs);

            userFn.apply(window, finalArgs);
        }
    }

    function mapArray(userFn, collection){
        var newCollection = [];

        collection.forEach(function(value){
            newCollection.push(userFn(value));
        });

        return newCollection;
    }

    function mapObject(userFn, collection){
        var newCollection = {},
            key;

        for(key in collection){
            newCollection[key] = userFn(collection[key]);
        }

        return newCollection;
    }

    //External finctions
    function filter(comparator, collection){
        var newCollection = [];

        collection.forEach(function(value){
            if(comparator(value)){
                newCollection.push(value);
            }
        });

        return newCollection;
    }

    function rpartial(){
        var args = Array.prototype.slice.call(arguments, 0);
        return generalPartial.apply(window, ["left"].concat(args));
    }

    function lpartial(userFn){
        var args = Array.prototype.slice.call(arguments, 0);
        return generalPartial.apply(window, ["right"].concat(args));
    }

    function map(userFn, collection){
        var isArray = (Object.prototype.toString.call(collection) === '[object Array]');

        return (isArray) ? mapArray(userFn, collection) : mapObject(userFn, collection);
    }

    function recur(){
        var args = Array.prototype.slice.call(arguments),
            userFn = args.pop();

        userFn.apply(window, args);
    }

    function thread(value){
        var userFns = Array.prototype.slice.call(arguments, 1),
            returnedValue = value;

        userFns.forEach(function(userFn){
            returnedValue = userFn(returnedValue);
        });

        return returnedValue;
    }

    JFP = {
        filter: filter,
        lpartial: lpartial,
        partial: rpartial,
        rpartial: rpartial,
        map: map,
        recur: recur,
        thread: thread
    };

    j = JFP;
})();