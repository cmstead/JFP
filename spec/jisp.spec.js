(function(){
    'use strict';

    describe('Jisp', function(){

        it('should be a global object', function(){
            expect(typeof Jisp).toBe('object');
        });

        describe('partial', function(){

            it("should be a function", function(){
                expect(typeof Jisp.partial).toBe('function');
            });

            it('should return a function', function(){
                expect(typeof Jisp.partial(function(){})).toBe('function');
            });

            it('should throw an error if the first argument is not a function', function(){
                expect(function(){Jisp.partial()}).toThrow();
            });

            it('should return curried function', function(){
                var spy = jasmine.createSpy('curriedFn');

                Jisp.partial(spy)();

                expect(spy).toHaveBeenCalled();
            });

            it('should execute curried function with provided arguments', function(){
                var spy = jasmine.createSpy('curriedFn');

                Jisp.partial(spy, "test")();

                expect(spy).toHaveBeenCalledWith("test");
            });

            it('should execute curried function with new arguments appended to provided args', function(){
                var spy = jasmine.createSpy('curriedFn');

                Jisp.partial(spy, "this", "is", "a")("test");

                expect(spy).toHaveBeenCalledWith("this", "is", "a", "test")
            });

        });

        describe('thread', function(){
            var partial = Jisp.partial;

            it("should be a function", function(){
                expect(typeof Jisp.thread).toBe('function');
            });
        });

    });

})();