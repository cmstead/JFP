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

        it('should support complex compositions', function () {
            function compositeFn (data) {
                return j.compose(j.partial(j.reduce, j.add),
                                 j('map', j('pick', 'value')),
                                 j('filter', j.compose(j.isEven, j('pick', 'value'))),
                                 j('sort', function (a, b) { return a.value - b.value; }))(data);
            }

            var testData = [
                { value: 3 },
                { value: 4 },
                { value: 2 },
                { value: 1 },
                { value: 5 },
                { value: 6 }
            ],
            result = compositeFn(testData);
                        
            expect(result).toBe(12);
        });

    });

    describe('pipeline', function(){

        it('should return passed value when no functions are passed', function(){
            expect(j.pipeline('foo')).toBe('foo');
        });

        it('should execute composed functions in left-right order', function(){
            var add5 = j.partial(j.add, 5),
                multiply2 = j.partial(j.multiply, 2),
                add2 = j.partial(j.add, 2);

            expect(j.pipeline(0, add5, multiply2, add2)).toBe(12)
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

    describe('partialReverse', function(){
        
        it('should return a partially applied function', function(){
            var spy = jasmine.createSpy('spy');
            j.partialReverse(spy, 'a', 'b')();
            expect(spy).toHaveBeenCalledWith('a', 'b');
        });
        
        it('should reverse any secondary arguments', function(){
            var spy = jasmine.createSpy('spy');
            j.partialReverse(spy, 'a', 'b')('c', 'd', 'e');
            expect(spy).toHaveBeenCalledWith('a', 'b', 'e', 'd', 'c');
        });
        
    });
    
    describe('deref', function(){
        
        var testData;
        
        beforeEach(function(){
            testData = {
                test1: {
                    test2: [
                        { test3: 'foo' },
                        { test3: 'bar' },
                        { test3: 'baz' },
                        { test3: 'quux' }
                    ]
                }
            };
        });
        
        it('should return provided value', function(){
            var originalData = {}
            expect(j.deref(originalData)).toBe(originalData);
        });
        
        it('should return null if data is falsey', function(){
            expect(j.deref()).toBe(null);
        });

        it('should return null if key is provided but object is null', function(){
            expect(j.deref(null, 'test')).toBe(null);
        });
        
        it('should dereference a single key in ', function(){
            expect(j.deref(testData, 'test1')).toBe(testData.test1);
        });
        
        it('should dereference a delimited key', function(){
            expect(j.deref(testData, 'test1.test2')).toBe(testData.test1.test2);
        });
        
        it('should dereference numeric keys', function(){
            expect(j.deref(testData, 'test1.test2.1')).toBe(testData.test1.test2[1]);
        });
        
        it('should return default value if return value would be null', function(){
            expect(j.deref(null, null, 'foo')).toBe('foo');
        });
        
        it('should support key first, object second calling', function(){
            expect(j.deref('test1.test2.1', testData)).toBe(testData.test1.test2[1]);
        });
        
    });
    
    describe('clone', function(){
        
        it('should return original value if it is a primitive data type', function(){
            expect(j.clone(5)).toBe(5);
        });
        
        it('should return a copy of an empty array', function(){
            var testArray = [],
                result = j.clone(testArray);
                
            expect(result).not.toBe(testArray);
            expect(j.isArray(result)).toBe(true);
        });
       
        it('should return a copy of an empty object', function () {
            var testObject = {},
                result = j.clone(testObject);
                
            expect(result).not.toBe(testObject);
            expect(j.isArray(result)).toBe(false);
        });

        it('should copy a one-dimensional array', function () {
            var testArray = [ 'a', 'b', 'c', 'd', 'e' ],
                result = j.clone(testArray);
            
            expect(JSON.stringify(result)).toBe(JSON.stringify(testArray));
        });
        
        it('should copy a single-depth object', function () {
            var testObject = {
                    a: 1,
                    b: 2,
                    c: 3,
                    d: 4
                },
                result = j.clone(testObject);
            
            expect(JSON.stringify(result)).toBe(JSON.stringify(testObject));
        });
        
        it('should copy objects more than 1 layer deep', function () {
            var testObject = {
                foo: {
                    bar: 'baz'
                }
            },
            result = j.clone(testObject);
            
            expect(result.foo).not.toBe(testObject.foo);
            expect(JSON.stringify(result.foo)).toBe(JSON.stringify(testObject.foo));
        });
        
        it('should only clone to specified depth', function () {
            var testObject = {
                    layer1: {
                        layer2: {
                            foo: 'bar'
                        }
                    }
                },
                result = j.clone(testObject, 1);
            
            expect(result.layer1).not.toBe(testObject.layer1);
            expect(result.layer1.layer2).toBe(testObject.layer1.layer2);
        });
        
        it('should throw RangeError if object contains a circular reference', function () {
            var testObject = {
                layer1: {}
            },
            err;
            
            testObject.layer1 = {
                layer2: testObject
            };
            
            try {
                j.clone(testObject);
            } catch (cloneErr) {
                err = cloneErr;
            }
            
            expect(err instanceof RangeError).toBe(true);
        });

    });
    
    describe('maybeType', function () {
        
        it('should return a function', function () {
            expect(typeof j.maybeType('string')).toBe('function');
        });
        
        it('should perform a successful maybe check with the returned value', function () {
            expect(j.maybeType('string')('foo')).toBe('foo');
        });

        it('should perform a successful maybe check with the returned value', function () {
            expect(j.maybeType('string')([])).toBe(null);
        });
        
        it('should accept all arguments up front', function () {
            expect(j.maybeType('string', 'foo')).toBe('foo');
        });

    });
    
    describe('eitherType', function () {
        
        it('should return a function', function (){
            expect(typeof j.eitherType('string')).toBe('function');
        });

        it('should return a curried function', function () {
            function testFn () {
                j.eitherType('string')('bar')('foo');
            }
            
            expect(testFn).not.toThrow();
        });

        it('should perform a successful either check with returned function', function () {
            expect(j.eitherType('string')('bar', 'foo')).toBe('foo');
        });        

        it('should perform a failing either check with returned function', function () {
            expect(j.eitherType('string')('bar', [])).toBe('bar');
        });

        it('should accept all arguments up front', function () {
            expect(j.eitherType('string', 'bar', 'foo')).toBe('foo');
        });

    });
    
})();
