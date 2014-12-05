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

})();