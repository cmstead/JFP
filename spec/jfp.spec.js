(function(){
    'use strict';

    describe('JFP', function(){

        it('should be a global object', function(){
            expect(typeof JFP).toBe('object');
        });

        describe('rpartial', function(){

            it("should be a function", function(){
                expect(typeof j.rpartial).toBe('function');
            });

            it('should return a function', function(){
                expect(typeof j.rpartial(function(){})).toBe('function');
            });

            it('should return curried function', function(){
                var spy = jasmine.createSpy('curriedFn');

                j.rpartial(spy)();

                expect(spy).toHaveBeenCalled();
            });

            it('should execute curried function with provided arguments', function(){
                var spy = jasmine.createSpy('curriedFn');

                j.rpartial(spy, "test")();

                expect(spy).toHaveBeenCalledWith("test");
            });

            it('should execute curried function with new arguments appended to provided args', function(){
                var spy = jasmine.createSpy('curriedFn');

                j.rpartial(spy, "this", "is", "a")("test");

                expect(spy).toHaveBeenCalledWith("this", "is", "a", "test")
            });

        });

        describe('lpartial', function(){
            it('should execute curried function with new arguments appended to provided args', function(){
                var spy = jasmine.createSpy('curriedFn');

                j.lpartial(spy, "is", "a", "test")("this");

                expect(spy).toHaveBeenCalledWith("this", "is", "a", "test")
            });

        });

        describe('thread', function(){
            var partial = j.partial;

            it("should be a function", function(){
                expect(typeof j.thread).toBe('function');
            });

            it("should execute a function with an argument", function(){
                var spy = jasmine.createSpy('spy');

                j.thread(5, spy);

                expect(spy).toHaveBeenCalledWith(5);
            });

            it('should call multiple functions passing the last value into the next', function(){
                var spy = jasmine.createSpy('spy');

                function addEight(value){
                    return value + 8;
                }

                j.thread(5, addEight, spy);

                expect(spy).toHaveBeenCalledWith(13);
            });

            it('should return the value returned by the final function', function(){
                var finalValue = j.thread(5, function(value){ return value + 8; },
                                             function(value){ return value - 3; },
                                             function(value){ return value * value; });

                expect(finalValue).toBe(100);
            });
        });

        describe('recur', function(){

            it('should be a function', function(){
                expect(typeof j.recur).toBe('function');
            });

            it('should execute passed function', function(){
                var spy = jasmine.createSpy('callableFunction');

                j.recur(spy);

                expect(spy).toHaveBeenCalled();
            });

            it('should execute passed function with all passed arguments', function(){
                var spy = jasmine.createSpy('callableFunction');

                j.recur(1, 2, "test", "vars", spy);

                expect(spy).toHaveBeenCalledWith(1, 2, "test", "vars");
            });

        });

        describe('map', function(){

            function userFn(value){
                return value
            } //Use this when testing collection-related stuff

            it("should return an array when an array is passed", function(){
                var returnedCollection = j.map(userFn, []);

                expect(Object.prototype.toString.call(returnedCollection)).toBe('[object Array]');
            });

            it("should return an object when a non-array object is passed", function(){
                var returnedCollection = j.map(userFn, {});

                expect(Object.prototype.toString.call(returnedCollection)).not.toBe('[object Array]');
            });

            it("should not return the same collection as was passed", function(){
                var passedCollection = [1, 2, 3, 4],
                    returnedCollection = j.map(userFn, passedCollection);

                expect(returnedCollection).not.toBe(passedCollection);
            });

            it("should map a function on to an array", function(){
                var expectedCollection = [3, 6, 9, 12],
                    returnedCollection;

                function deltaFunction(value){
                    return value * 3;
                }

                returnedCollection = j.map(deltaFunction, [1, 2, 3, 4]);

                expect(JSON.stringify(expectedCollection)).toBe(JSON.stringify(returnedCollection));
            });

            it("should map a function on to an object", function(){
                var expectedCollection = {
                        'one': 3,
                        'two': 6,
                        'three': 9,
                        'four': 12
                    },
                    returnedCollection;

                function deltaFunction(value){
                    return 3 * value;
                }

                returnedCollection = j.map(deltaFunction, {
                    'one': 1,
                    'two': 2,
                    'three': 3,
                    'four': 4
                })

                expect(JSON.stringify(returnedCollection)).toBe(JSON.stringify(expectedCollection));
            });

        });

        describe('filter', function(){

            it('should return an array', function(){
                var returnedCollection = j.filter(function(){}, []),
                    typeValue = Object.prototype.toString.call(returnedCollection);

                expect(typeValue).toBe('[object Array]');
            });

            it('should filter an array with a comparator function', function(){
                var expectedCollection = [3, 6, 9],
                    returnedCollection;

                function comparator(value){
                    return (value % 3) === 0;
                }

                returnedCollection = j.filter(comparator, [1, 2, 3, 4, 5, 6, 7, 8, 9]);

                expect(JSON.stringify(expectedCollection)).toBe(JSON.stringify(returnedCollection));
            });

        });

    });

})();