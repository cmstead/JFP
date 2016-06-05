var j = require('../../dist/jfp');

describe('jfp object', function () {
    
    describe('pick', function () {
        
        it('should pick a value from an object by key', function () {
            var testObj = { foo: 'bar' };
            expect(j.pick('foo')(testObj)).toBe('bar');
        });
        
        it('should return nil if value does not exist', function () {
            var testObj = { foo: 'bar' };
            expect(j.isTypeOf('nil')(j.pick('bar')(testObj))).toBe(true);
        });
        
    });
    
    describe('deref', function () {
        var testObj;
        
        beforeEach(function () {
            testObj = {
                foo: {
                    bar: {
                        baz: [1, 2, 3, 4]
                    }
                }
            };
        });
        
        it('should return a value for a single layer dereference', function () {
            expect(j.deref('foo')(testObj)).toBe(testObj.foo);
        });
        
        it('should return a value for a single layer dereference', function () {
            expect(j.isTypeOf('nil')(j.deref('blar')(testObj))).toBe(true);
        });
        
        it('should return a value for a single layer dereference', function () {
            expect(j.deref('foo.bar.baz.1')(testObj)).toBe(2);
        });
        
    });
    
    describe('merge', function () {
        
        it('should merge two objects left to right', function () {
            
            var objA = {
                test1: 'test1a',
                test2: 'test2a'
            };
            
            var objB = {
                test2: 'test2b',
                test3: 'test2c'
            };
            
            var expected = {
                test1: 'test1a',
                test2: 'test2b',
                test3: 'test2c'
            };
            
            var result = j.merge(objA, objB);
            
            expect(result).not.toBe(objA);
            expect(result).not.toBe(objB);
            expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
            
        });
        
    });
    
});