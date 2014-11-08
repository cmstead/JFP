var jfp,
    j;

var j,
    jfp = (function(){
    'use strict';

    var JFP;

    //Predicates
    function isObject(value){
        return typeof value === 'object';
    }

    function isArray(value){
        return (isObject(value) &&
            Object.prototype.toString.call(value) === '[object Array]');
    }

    function when(predicate, userFn){
        var value = null;

        if(predicate){
            value = userFn();
        }

        return value;
    }

    function iif(predicate, success, failure){
        var value = null;

        when(predicate, function(){
            value = success();
        });

        when(!predicate, function(){
            value = failure();
        });

        return value;
    }

    //Utility
    function identity(obj){
        return obj;
    }

    function partial(userFn, direction){
        var args = Array.prototype.slice.call(arguments, 2);
        return function(){
            var newArgs = Array.prototype.slice.call(arguments, 0);

            newArgs = (direction === 'right') ?
                args.concat(newArgs) :
                newArgs.concat(args);

            userFn.apply(null, newArgs);
        };
    }

    function lpartial(userFn){
        var partialArgs = [userFn, 'left'],
            args = Array.prototype.slice.call(arguments, 1);

        partialArgs = partialArgs.concat(args);

        return partial.apply(null, partialArgs);
    }

    function rpartial(userFn){
        var partialArgs = [userFn, 'right'],
            args = Array.prototype.slice.call(arguments, 1);

        partialArgs = partialArgs.concat(args);

        return partial.apply(null, partialArgs);
    }

    function getFunctionArgs(passedFn){
        var params = passedFn.toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
            .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
            .split(/,/);

        when(params.length === 1 && params[0] === '', function(){
            params = [];
        });

        return params;
    }

    function curry(userFn){
        var params = getFunctionArgs(userFn),
            args = Array.prototype.slice.call(arguments, 1);

        function currier(){
            var newArgs = Array.prototype.slice.call(arguments, 0);
            args = args.concat(newArgs[0]);

            return iif(args.length >= params.length, function(){
                userFn.apply(null, args);
            }, function(){
                return curry.apply(null, [userFn].concat(args));
            });
        }

        return currier;
    }

    function thread(value){
        return value;
    }

    //Collections
    function copyArray(collection){
        var returnableArray = [];

        collection.forEach(function(value){
            returnableArray.push(value);
        });

        return returnableArray;
    }

    function copyObject(collection){
        var returnableObject = {},
            key;

        for(key in collection){
            returnableObject[key] = collection[key];
        }

        return returnableObject;
    }

    function copy(collection){
        var returnableCollection = collection;

        when(isObject(collection), function(){
            returnableCollection =
                iif(isArray(collection), function(){
                    return copyArray(collection);
                }, function(){
                    return copyObject(collection);
                });
        });

        return returnableCollection;
    }

    function eachArray(collection, userFn){
        collection.forEach(function(value, key){
            userFn(value, key);
        });

        return collection;
    }

    function eachObject(collection, userFn){

        function callFn(key){
            when(collection.hasOwnProperty(key), function(){
                userFn(collection[key], key);
            });
        }

        for(var key in collection){
            callFn(key);
        }

        return collection;
    }

    function each(collection, userFn){
        var newCollection = copy(collection);

        return iif(isArray(collection), function(){
            eachArray(newCollection, userFn);
        }, function() {
            eachObject(newCollection, userFn);
        });
    }

    function filter(collection, filterFn){
        var newCollection = (isArray(collection)) ? [] : {};

        function filterer(value, key){
            when(filterFn(value), function(){
                iif(isArray(collection), function(){
                    newCollection.push(value);
                }, function(){
                    newCollection[key] = value;
                });
            });
        }

        each(collection, filterer);

        return newCollection;
    }

    function map(collection, mappingFn){
        var newCollection = (isArray(collection)) ? [] : {};

        function mapper(value, key){
            iif(isArray(collection), function(){
                newCollection.push(mappingFn(value));
            }, function(){
                newCollection[key] = mappingFn(value);
            });
        }

        each(collection, mapper);

        return newCollection;
    }

    function recur(userFn){
        var args = Array.prototype.slice.call(arguments, 1);
        userFn.apply(null, args);
    }

    return {
        copy: copy,
        curry: curry,
        each: each,
        filter: filter,
        identity: identity,
        iif: iif,
        isArray: isArray,
        isObject: isObject,
        lpartial: lpartial,
        map: map,
        partial: rpartial,
        recur: recur,
        rpartial: rpartial,
        thread: thread,
        when: when
    };

})();

j = jfp;