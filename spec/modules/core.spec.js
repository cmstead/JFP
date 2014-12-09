(function(){
    'use strict';

    describe('apply', function(){

        it('should call the passed function', function(){
            var spy = jasmine.createSpy('userFn');
            j.apply(null, spy);

            expect(spy).toHaveBeenCalled();
        });

        it('should return function return value', function(){
            function returnFive(){
                return 5;
            }

            expect(j.apply(null, returnFive)).toBe(5);
        });

        it('should apply passed values', function(){
            function add(a, b){
                return a + b;
            }

            expect(j.apply([1, 2], add)).toBe(3);
        });

    });

    describe('concat', function(){

        it('should return an array', function(){
            expect(JSON.stringify(j.concat())).toBe('[]');
        });

        it('should return a matching array when called with one array', function(){
            expect(JSON.stringify(j.concat([1, 2, 3]))).toBe('[1,2,3]');
        });

        it('should return two arrays, concatenated', function(){
            expect(JSON.stringify(j.concat([1, 2], [3, 4]))).toBe('[1,2,3,4]');
        });

    });

    describe('slice', function(){

        it('should return an array', function(){
            expect(JSON.stringify(j.slice())).toBe('[]');
        });

        it('should return array matching original when slicing at 0', function(){
            expect(JSON.stringify(j.slice(0, [1, 2, 3, 4]))).toBe('[1,2,3,4]');
        });

        it('should return a copy of the original array', function(){
            var testArray = [1, 2, 3, 4];
            expect(j.slice(0, testArray)).not.toBe(testArray);
        });

        it('should slice the first n objects off passed array', function(){
            expect(JSON.stringify(j.slice(2, [1, 2, 3, 4]))).toBe('[3,4]');
        });

        it('should slice the first n objects of passed array and return m objects', function(){
            expect(JSON.stringify(j.slice(1, [1, 2, 3, 4, 5, 6], 4))).toBe('[2,3,4]');
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
        
        it('should execute the passed function if 0 is passed', function(){
            var spy = jasmine.createSpy('userFn');
            j.maybe(0, spy, 0);
            expect(spy).toHaveBeenCalledWith(0);
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

    describe('compose', function(){

        it('should call function passed into compose', function(){
            var spy = jasmine.createSpy('userFn');
            j.compose(spy)();
            expect(spy).toHaveBeenCalled();
        });

        it('should call two functions in serial', function(){
            var spy = jasmine.createSpy('userFn');

            function userFn(){
                return 'test';
            }

            j.compose(spy, userFn)();

            expect(spy).toHaveBeenCalledWith('test');
        });

        it('should return the result of the composed functions', function(){
            function add3(value){
                return value + 3;
            }

            expect(j.compose(add3, add3, add3)(5)).toBe(14);
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
            expect(spy.callCount).toBe(2);
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

})();