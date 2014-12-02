(function(){
    'use strict';

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

    describe('cons', function(){

        it('should return an empty array when no arguments are passed', function(){
            expect(JSON.stringify(j.cons())).toBe('[]');
        });

        it('should return an array of one element if only a single element is passed', function(){
            expect(JSON.stringify(j.cons(5))).toBe('[5]');
        });

        it('should return an array containing the first argument and the rest of a second array', function(){
            var testArray = [1, 2, 3, 4],
                returnedArray = j.cons(5, testArray);

            expect(JSON.stringify(returnedArray)).toBe('[5,1,2,3,4]');
        });

    });

})();