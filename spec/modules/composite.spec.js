var jfp = require('../../dist/jfp.js'),
    j = jfp;

(function(){
    'use strict'

    describe('compose', function(){

        it('should return identity function if no function is passed', function(){
            expect(j.compose()).toBe(j.identity);
        });

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

    describe('pipline', function(){

        it('should return a function', function(){
            expect(typeof j.pipeline()).toBe('function');
        });

        it('should execute composed functions in left-right order', function(){
            var add5 = j.partial(j.add, 5),
                multiply2 = j.partial(j.multiply, 2),
                add2 = j.partial(j.add, 2);

            expect(j.pipeline(add5, multiply2, add2)(0)).toBe(12)
        });

    });

    describe('compact', function(){

        it('should remove falsey values from an array', function(){
            var testArray = [1, 2, 0, false, undefined, null, true];

            expect(JSON.stringify(j.compact(testArray))).toBe('[1,2,true]');
        });

    });

    describe('eitherIf', function(){

        it('should return default value when nothing else is passed', function(){
            expect(j.eitherIf('default')).toBe('default');
        });

        it('should return test value when default and test value are passed', function(){
            expect(j.eitherIf('default', 'test')).toBe('test');
        });

        it('should return default value when predicateValue is false', function(){
            expect(j.eitherIf('default', 'test', false)).toBe('default');
        });

        it('should return test value when passed predicateValue is true', function(){
            expect(j.eitherIf('default', 'test', true)).toBe('test');
        });

    });

    describe('eitherWhen', function(){

        it('should return default when only a default value is passed', function(){
            expect(j.eitherWhen('default')).toBe('default');
        });

        it('should return default if only default and predicate value are passed', function(){
            expect(j.eitherWhen('default', true)).toBe('default');
        });

        it('should return result of function when predicate value is true and function result is truthy', function(){
            expect(j.eitherWhen('default', true, j.partial(j.identity, 5))).toBe(5);
        });

        it('should return default if result of function is falsey', function(){
            expect(j.eitherWhen('default', true, j.partial(j.identity, false))).toBe('default');
        });

        it('should not call passed function if predicate value is false', function(){
            var spy = jasmine.createSpy('spy');
            j.eitherWhen('default', false, spy);

            expect(spy).not.toHaveBeenCalled();
        });

    });

})();
