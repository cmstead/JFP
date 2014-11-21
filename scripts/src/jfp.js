var j,
    jfp = (function(){
        'use strict';

        var JFP;

        //Predicates
        function not(value){
            return !value;
        }

        function isEven(value){
            return value % 2 === 0;
        }
        
        function isGreater(a, b){
            return a > b;
        }
        
        function isLess(a, b){
            return a < b;
        }
        
        function isEqual(a, b){
            return a === b;
        }

        /**
         * @function isObject
         * @param {*} value A value to be tested
         * @returns {boolean}
         * @description Predicate function to test whether a value is an object
         */
        function isObject(value){
            return typeof value === 'object';
        }

        /**
         * @function isArray
         * @param {*} value A value to be tested
         * @returns {boolean}
         * @description Predicate function to test whether a value is an array
         */
        function isArray(value){
            return (isObject(value) &&
                Object.prototype.toString.call(value) === '[object Array]');
        }

        /**
         * @function when
         * @param {boolean} predicate Truey/falsey value
         * @param {function} userFn executes when predicate is true
         * @returns {*}
         * @description Executes userFn when predicate evaluates to true
         */
        function when(predicate, userFn){
            var value = null;

            if(predicate){
                value = userFn();
            }

            return value;
        }

        /**
         * @function iif
         * @param {boolean} predicate Truey/falsey value
         * @param {function} success Function to execute on predate truey
         * @param {function} failure Function to execute on predicate falsey
         * @returns {*}
         * @description Executes success on true, failure on false
         */
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

        function compose(){
            var args = Array.prototype.slice.call(arguments, 0);
            
            return function(){
                var finalValue = Array.prototype.slice.call(arguments, 0),
                    userFn;
                
                while(args.length > 0){
                    userFn = args.pop();
                    finalValue = [userFn.apply(null, finalValue)];
                }
                
                //final value should always be an array containing the last result.
                return finalValue[0];
            };
        }

        /**
         * @function identity
         * @param {*} obj Data to return
         * @returns {*}
         * @description Returns provided value unaltered
         */
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

        /**
         * @function lpartial
         * @param {function} userFn Function to apply arguments to
         * @returns {*}
         * @description Performs a left-partial application of arguments
         */
        function lpartial(userFn){
            var partialArgs = [userFn, 'left'],
                args = Array.prototype.slice.call(arguments, 1);

            partialArgs = partialArgs.concat(args);

            return partial.apply(null, partialArgs);
        }

        /**
         * @function rpartial
         * @param {function} userFn Function to apply arguments to
         * @returns {*}
         * @description Performs a right-partial application of arguments
         */
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

        /**
         * @function curry
         * @param {function} userFn Function for curried application
         * @returns {function}
         * @description Provides single-value currying
         */
        function curry(userFn){
            var params = getFunctionArgs(userFn),
                args = Array.prototype.slice.call(arguments, 1);

            function currier(){
                var newArgs = Array.prototype.slice.call(arguments, 0);
                args = args.concat(newArgs);

                return iif(args.length >= params.length, function(){
                    userFn.apply(null, args);
                }, function(){
                    return curry.apply(null, [userFn].concat(args));
                });
            }

            return currier;
        }

        /**
         * @function thread
         * @param {*} value
         * @param {function} userFn optionally multiple functions can be passed in for resolution
         * @returns {*}
         * @description Threads values through each provided function and returns the result
         */
        function thread(value){
            var finalValue = value,
                functions = Array.prototype.slice.call(arguments, 1);

            functions.forEach(function(userFn){
                finalValue = userFn(finalValue);
            });

            return finalValue;
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

        /**
         * @function copy
         * @param {object} collection object/array
         * @returns {*}
         * @description Returns a copy of array or object
         */
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

        /**
         * @function each
         * @param {object} collection object/array
         * @param {function} userFn
         * @returns {*}
         * @description Performs provided function on each element of collection
         */
        function each(collection, userFn){
            var newCollection = copy(collection);

            return iif(isArray(collection), function(){
                eachArray(newCollection, userFn);
            }, function() {
                eachObject(newCollection, userFn);
            });
        }

        /**
         * @function filter
         * @param {object} collection object/array
         * @param {function} predicate Function that returns a boolean
         * @returns {Array}
         * @description returns collection of elements which evaluate true for predicate function
         */
        function filter(predicate, collection){
            var newCollection = (isArray(collection)) ? [] : {};

            function filterer(value, key){
                when(predicate(value), function(){
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

        /**
         * @function map
         * @param {object} collection object/array
         * @param {function} mappingFn Function to map onto collection elements
         * @returns {object}
         * @description Returns new object with mapping function applied to each object.
         */
        function map(mappingFn, collection){
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
        
        function pick(key, obj){
            return obj[key];
        }

        /**
         * @function recur
         * @param {function} userFn
         * @description Calls passed function with all arguments - use for mutual recursion
         */
        function recur(userFn){
            var args = Array.prototype.slice.call(arguments, 1);
            userFn.apply(null, args);
        }
        
        /* Data functions */
        
        function either(defaultValue, testValue){
            return (!!testValue || testValue === 0) ? testValue : defaultValue;
        }
        
        function identity(obj){
            return obj;
        }

        function maybe(defaultValue, userFn, maybeValue){
            return (either(defaultValue, maybeValue) === defaultValue) ?
                defaultValue :
                userFn(maybeValue);
        }

        /* Reduce-safe function */

        function add(){
            var sum = 0,
                values = Array.prototype.slice.call(arguments, 0);

            values.forEach(function(value){
                sum += value;
            });

            return sum;
        }

        function multiply(){
            var product = 1,
                values = Array.prototype.slice.call(arguments, 0);

            values.forEach(function(value){
                product *=  value;
            });

            return product;
        }
        
        return {
            add: add,
            compose: compose,
            copy: copy,
            curry: curry,
            each: each,
            either: either,
            filter: filter,
            identity: identity,
            iif: iif,
            isArray: isArray,
            isEven: isEven,
            isEqual: isEqual,
            isGreater: isGreater,
            isLess: isLess,
            isObject: isObject,
            lpartial: lpartial,
            map: map,
            maybe: maybe,
            multiply: multiply,
            not: not,
            partial: rpartial,
            pick: pick,
            recur: recur,
            rpartial: rpartial,
            thread: thread,
            when: when
        };

    })();

j = jfp;