(function(){
    'use strict';

    describe('apply', function(){

        it('should call the passed function', function(){
            var spy = jasmine.createSpy('userFn');
            j.apply(spy);

            expect(spy).toHaveBeenCalled();
        });

        it('should return function return value', function(){
            function returnFive(){
                return 5;
            }

            expect(j.apply(returnFive)).toBe(5);
        });

        it('should apply passed values', function(){
            function add(a, b){
                return a + b;
            }

            expect(j.apply(add, [1, 2])).toBe(3);
        });

    });

    describe('identity', function(){

        it('should return a passed object', function(){
            var obj = { test: 'test' };
            expect(j.identity(obj)).toBe(obj);
        });

    });

    describe('maybe', function(){

        it('should return the default value if passed value is falsey', function(){
            var defaultValue = { test: 'test' };
            expect(j.maybe(defaultValue, j.identity, null)).toBe(defaultValue);
        });

        it('should return passed value if it is truey and function is identity', function(){
            var testObj = { test: 'test' };
            expect(j.maybe('default', j.identity, testObj)).toBe(testObj);
        });

        it('should call passed function with passed object', function(){
            var testObj = { test: 'test' },
                spy = jasmine.createSpy('userFn');
            j.maybe('test', spy, testObj);
            expect(spy).toHaveBeenCalledWith(testObj);
        });

    });

    describe('either', function(){

        it('should return the default value if the passed value is falsey', function(){
            var defaultValue = { test: 'test' };
            expect(j.either(defaultValue, null)).toBe(defaultValue);
        });

        it('should return passed value if it is truey', function(){
            var testValue = { test: 'test' };
            expect(j.either('test', testValue)).toBe(testValue);
        });

    });

})();