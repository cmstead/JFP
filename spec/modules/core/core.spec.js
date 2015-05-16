var jfp = require('../../../dist/jfp.js'),
    j = jfp;

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

    describe('countArguments', function(){

        it('should return 0 when no function is passed', function(){
            expect(j.countArguments()).toBe(0);
        });

        it('should return 0 if a function with no arguments is passed', function(){
            expect(j.countArguments(function(){})).toBe(0);
        });

        it('should return 1 if function has one argument', function(){
            expect(j.countArguments(function(value){})).toBe(1);
        });

        it('should return count of n arguments', function(){
            expect(j.countArguments(function(value1, value2, value3){})).toBe(3);
        });

    });

    describe('identity', function(){

        it('should return a passed object', function(){
            var obj = { test: 'test' };
            expect(j.identity(obj)).toBe(obj);
        });

    });

    describe('shortCircuit', function(){

        it('should return the default value if passed value is falsey', function(){
            var defaultValue = { test: 'test' };
            expect(j.shortCircuit(defaultValue, j.identity, null)).toBe(defaultValue);
        });

        it('should return passed value if it is truey and function is identity', function(){
            var testObj = { test: 'test' };
            expect(j.shortCircuit('default', j.identity, testObj)).toBe(testObj);
        });

        it('should call passed function with passed object', function(){
            var testObj = { test: 'test' },
                spy = jasmine.createSpy('userFn');
            j.shortCircuit('test', spy, testObj);
            expect(spy).toHaveBeenCalledWith(testObj);
        });

        it('should execute the passed function if 0 is passed', function(){
            var spy = jasmine.createSpy('userFn');
            j.shortCircuit(0, spy, 0);
            expect(spy).toHaveBeenCalledWith(0);
        });

    });

    describe('maybe', function(){

        it('should return null if value is falsey', function(){
            expect(j.maybe(false)).toBe(null);
        });

        it('should return value if value is truthy', function(){
            expect(j.maybe(true)).toBe(true);
        });

        it('should return null if value does not match type', function(){
            expect(j.maybe('foo', 'boolean')).toBe(null);
        });

        it('should return value if it matches type', function(){
            expect(j.maybe('foo', 'string')).toBe('foo');
        });

    });

    describe('either', function(){

        it('should return the default value if the passed value is falsey', function(){
            var defaultValue = { test: 'test' };
            expect(j.either(defaultValue, null)).toBe(defaultValue);
        });

        it('should return passed value if it is truthy', function(){
            var testValue = { test: 'test' };
            expect(j.either('test', testValue)).toBe(testValue);
        });

        it('should return default value if passed value is a type mismatch', function(){
            expect(j.either('test', 1234, 'string')).toBe('test');
        });

        it('should return passed value if passed value is a type match', function(){
            expect(j.either('test', 'foo', 'string')).toBe('foo');
        });

    });

    describe('partial', function(){

        it('should return a function', function(){
            expect(typeof j.partial()).toBe('function');
        });

        it('should call spy when returned function is called', function(){
            var spy = jasmine.createSpy('userFn');
            j.partial(spy)();
            expect(spy).toHaveBeenCalled();
        });

        it('should call spy with applied values', function(){
            var spy = jasmine.createSpy('userFn');
            j.partial(spy, 1, 2)();
            expect(spy).toHaveBeenCalledWith(1, 2);
        });

        it('should call spy with applied and new arguments', function(){
            var spy = jasmine.createSpy('userFn');
            j.partial(spy, 1, 2)(3, 4);
            expect(spy).toHaveBeenCalledWith(1, 2, 3, 4);
        });

        it('should return returned functionValue', function(){
            function add(a, b){
                return a + b;
            }

            expect(j.partial(add, 3)(2)).toBe(5);
        });

    });

    describe('rpartial', function(){

        it('should return a function', function(){
            expect(typeof j.rpartial()).toBe('function');
        });

        it('should call spy when returned function is called', function(){
            var spy = jasmine.createSpy('userFn');
            j.rpartial(spy)();
            expect(spy).toHaveBeenCalled();
        });

        it('should call spy with applied values', function(){
            var spy = jasmine.createSpy('userFn');
            j.rpartial(spy, 1, 2)();
            expect(spy).toHaveBeenCalledWith(1, 2);
        });

        it('should call spy with applied and new arguments', function(){
            var spy = jasmine.createSpy('userFn');
            j.rpartial(spy, 1, 2)(3, 4);
            expect(spy).toHaveBeenCalledWith(3, 4, 1, 2);
        });

        it('should return returned functionValue', function(){
            function divide(a, b){
                return a / b;
            }

            expect(j.rpartial(divide, 2)(6)).toBe(3);
        });

    });

    describe('curry', function(){

        it('should return null if no function is passed', function(){
            expect(j.curry()).toBe(null);
        });

        it('should return a function if all arguments are not satisfied', function(){
            function test(value){}

            expect(typeof j.curry(test)).toBe('function');
        });

        it('should call the passed function if all arguments are satisfied', function(){
            var spy = jasmine.createSpy('userFn');
            j.curry(spy);
            expect(spy).toHaveBeenCalled();
        });

        it('should return null if function arguments are satisfied', function(){
            function test(value1){}
            expect(j.curry(test, 1)).toBe(null);
        });

        it('should call function with all passed args when function is called', function(){
            var spy = jasmine.createSpy('sumSpy');

            function sum(a, b, c, d){
                spy(a, b, c, d);
            }

            j.curry(sum, 1)(2, 3)(4);

            expect(spy).toHaveBeenCalledWith(1, 2, 3, 4);
        });

        it('should return the result of the called function', function(){
            var spy = jasmine.createSpy('sumSpy');

            function sum(a, b, c, d){
                return a + b + c + d;
            }

            expect(j.curry(sum)(1)(2, 3)(4)).toBe(10);
        });

        it('should work with function and value arguments', function(){
            var curriedFn;

            function testFn(userFn, valueSet){
                return userFn(valueSet);
            }

            function add(valueSet){
                return valueSet[0] + valueSet[1];
            }

            curriedFn = j.curry(testFn);

            expect(curriedFn(add)([5, 6])).toBe(11);
        });

    });

    describe('recur', function(){

        it('should not throw an error if no function is provided', function(){
            expect(j.partial(j.recur)).not.toThrow();
        });

        it('should call passed function', function(){
            var spy = jasmine.createSpy('userFn');
            j.recur(spy);
            expect(spy).toHaveBeenCalled();
        });

        it('should call passed function when it returns a recursion', function(){
            var spy = jasmine.createSpy('userFnSpy');

            function recursiveFn(recur, index){
                var localIndex = j.either(0, index);
                spy();
                return (++localIndex < 2) ? recur(localIndex) : localIndex;
            }

            j.recur(recursiveFn);
            expect(spy.calls.count()).toBe(2);
        });

        it('should call passed function with initial values', function(){
            var spy = jasmine.createSpy('userFn');

            function userFn(recur, a, b){
                spy(a, b);
            }

            j.recur(userFn, 1, 2);
            expect(spy).toHaveBeenCalledWith(1, 2);
        });

        it('should return result of recursion', function(){
            function factorial(recur, value, product){
                var newProduct = j.either(1, product) * value;
                return (--value > 0) ? recur(value, newProduct) : newProduct;
            }

            expect(j.recur(factorial, 5)).toBe(120);
        });

    });

    describe('when', function(){

        it('should execute passed function when value evaluates to true', function(){
            var spy = jasmine.createSpy('spy');
            j.when(true, spy);
            expect(spy).toHaveBeenCalled();
        });

        it('should not execute passed function when value evaluates to false', function(){
            var spy = jasmine.createSpy('spy');
            j.when(false, spy);
            expect(spy).not.toHaveBeenCalled();
        });

        it('should return result of executed function if value evaluates to true', function(){
            var returnedValue;

            function return5(){
                return 5;
            }

            returnedValue = j.when(true, return5);

            expect(returnedValue).toBe(5);
        });

        it('should return null when value evaluates to false', function(){
            var returnedValue = j.when(false, j.identity);
            expect(returnedValue).toBe(null);
        });

        it('should call passed function with provided arguments if value is true', function(){
            var spy = jasmine.createSpy('spy');

            j.when(true, spy, 1, 2, 3);

            expect(spy).toHaveBeenCalledWith(1, 2, 3);
        });

    });

    describe('execute', function(){

        it('should call passed function', function(){
            var spy = jasmine.createSpy('callback');

            j.execute(spy);

            expect(spy).toHaveBeenCalled();
        });

        it('should return function output value', function(){
            function callback(){
                return 'foo';
            }

            expect(j.execute(callback)).toBe('foo');
        });

        it('should call function with provided arguments', function(){
            var spy = jasmine.createSpy('spy');
            j.execute(spy, 1, 2, 3);
            expect(spy).toHaveBeenCalledWith(1, 2, 3);
        });

    });

})();
