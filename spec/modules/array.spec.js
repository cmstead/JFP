var j = require('../../dist/jfp');

describe('jfp array', function () {
    
    describe('nth', function () {
        
        it('should return the nth value of an array', function () {
            expect(j.nth(1)([1,2,3,4])).toBe(2);
        });
        
        it('should return nil if value is undefined', function () {
            var result = j.nth(1)([]);
            expect(j.isTypeOf('nil')(result)).toBe(true);
        });
        
    });
    
    describe('first', function () {
        
        it('should return first element of an array', function () {
            expect(j.first([1, 2, 3])).toBe(1);
        });
        
        it('should return nil if first element does not exist', function () {
            var result = j.first([]);
            expect(j.isTypeOf('nil')(result)).toBe(true);
        });
        
    });
    
    describe('rest', function () {
        
        it('should return a new array without the first element', function () {
            var result = j.rest([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[2,3,4]');
        });
        
    });
    
    describe('lastIndexOf', function () {
        
        it('should return final index of an array', function () {
            expect(j.lastIndexOf([1, 2, 3, 4])).toBe(3);
        });
        
        it('should return correct final index of an array', function () {
            expect(j.lastIndexOf([])).toBe(0);
        });
        
    });
    
    describe('take', function () {
        
        it('should take the first 1 elements', function () {
            var result = j.take(1)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[1]');
        });
        
        it('should take the all elements if length is too big', function () {
            var result = j.take(9)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[1,2,3,4]');
        });
        
    });
    
    describe('drop', function () {
       
        it('should drop 0th element', function () {
            var result = j.drop(0)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[2,3,4]');
        });
        
        it('should drop 3rd element', function () {
            var result = j.drop(2)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[1,2,4]');
        });
        
    });
    
    describe('foldl', function () {
        
        function add (a, b){
            return a + b;
        }
        
        it('should add no values', function () {
            expect(j.foldl(add, 0)([])).toBe(0);
        });
        
        it('should add the initial value and a single value', function () {
            expect(j.foldl(add, 0)([1])).toBe(1);
        });
        
        it('should add the initial value and multiple values', function () {
            expect(j.foldl(add)([1, 2, 3, 4])).toBe(10);
        });
        
    });
    
    describe('foldr', function () {
        
        function reverseDivide (a, b) {
            return b / (a + 1);
        }
        
        it('should fold from right to left', function () {
            expect(j.foldr(reverseDivide, 1)([12, 36, 6, 2])).toBe(1.2);
        });
        
    });
    
});