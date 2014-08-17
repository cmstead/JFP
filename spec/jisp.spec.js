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

            it('should throw an error if the first argument is not a function', function(){
                expect(function(){j.rpartial()}).toThrow();
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

    });

})();