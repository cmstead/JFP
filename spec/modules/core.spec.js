var j = require('../../dist/jfp.js');

describe('jfp core', function () {
    
    describe('maybe', function () {
        
        var isNil = j.isTypeOf('nil');
        
        it('should return nil if value is not a type match', function () {
            var result = j.maybe('number')('foo');
            
            expect(isNil(result)).toBe(true);
        });
        
        it('should return value if value is a type match', function () {
            var result = j.maybe('string')('foo');
            
            expect(result).toBe('foo');
        });
        
    });
    
    describe('either', function () {
        
        it('should return value if value matches type', function () {
            expect(j.either('number')(0)(42)).toBe(42);
        });
        
        it('should return default value if value does not match type', function () {
            expect(j.either('number')(0)('foo')).toBe(0);
        });
        
    });
    
    describe('identity', function () {
        
        it('should return passed value', function () {
            expect(j.identity('foo')).toBe('foo');
        });
        
    });
    
    describe('always', function () {
        
        it('should return bound value ', function () {
            expect(j.always('foo')()).toBe('foo');
        });
        
    });
    
    describe('cons', function () {
        
        it('should return new array with value prepended', function () {
            var result = j.cons(1, [2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[1,2,3,4]');
        });
        
        it('should return new array without undefined prepended', function () {
            var result = j.cons(undefined, [2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[2,3,4]');
        });
        
    });
    
    describe('slice', function () {
        
        it('should slice starting at an initial index', function () {
            var result = j.slice(1)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[2,3,4]');
        });
        
        it('should slice starting at an initial index', function () {
            var result = j.slice(1, 3)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[2,3]');
        });
        
    });
    
    describe('partial', function () {
        
        function add (a, b, c, d){
            return a + b + c + d;
        }
        
        it('should partially apply values to a function', function () {
            var appliedAdd = j.partial(add, 1, 2);
            expect(appliedAdd(3, 4)).toBe(10);
        });
        
    });
    
    describe('rpartial', function () {
        
        function compute (a, b, c, d){
            return (a + b) / (c + d);
        }
        
        it('should partially apply values to a function', function () {
            var appliedCompute = j.rpartial(compute, 1, 2);
            expect(appliedCompute(4, 5)).toBe(3);
        });
        
    });
    
    describe('recur', function () {
        
        function fac (recur, n, current){
            var result = !j.isTypeOf('undefined')(current) ? current : 1;
            return n === 0 ? result : recur(n-1, result * n); 
        }
        
        it('should evaluate fac 0 correctly', function () {
            expect(j.recur(fac)(0)).toBe(1);
        });
        
        it('should evaluate fac 2 correctly', function () {
            expect(j.recur(fac)(2)).toBe(2);
        });
        
        it('should evaluate fac 30 correctly', function () {
            expect(j.recur(fac)(30)).toBe(2.652528598121911e+32);
        });
        
    });
    
    describe('compose', function () {
        
        function inc (value){
            return value + 1;
        }
        
        it('should compose one function', function () {
            var add1 = j.compose(inc);
            
            expect(add1(5)).toBe(6);
        });
        
        it('should compose two functions', function () {
            var add2 = j.compose(inc, inc);
            
            expect(add2(5)).toBe(7);
        });
        
        it('should compose multiple functions', function () {
            var addMany = j.compose(inc, inc, inc, inc, inc, inc);
            
            expect(addMany(5)).toBe(11);
        });
        
    });
    
});