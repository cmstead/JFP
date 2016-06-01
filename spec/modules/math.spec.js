var j = require('../../dist/jfp');

describe('JFP math', function () {
    
    describe('add', function () {
        
        it('should add two numbers as a curried function', function () {
            expect(j.add(5)(6)).toBe(11);
        });
        
        it('should add two numbers with a standard call', function () {
            expect(j.add(5, 6)).toBe(11);
        });
        
    });
    
    describe('subtract', function () {
        
        it('should subtract first from second when curried', function () {
            expect(j.subtract(5)(6)).toBe(1);
        });
        
        it('should subtract two numbers second when called normally', function () {
            expect(j.subtract(5, 6)).toBe(-1);
        });
        
    });
    
    describe('multiply', function () {
        
        it('should multiply two numbers as a curried function', function () {
            expect(j.multiply(5)(6)).toBe(30);
        });
        
        it('should multiply two numbers as a standard function call', function () {
            expect(j.multiply(5, 6)).toBe(30);
        });
        
    });
    
    describe('divide', function () {
        
        it('should divide second number by first when called as a curried function', function () {
            expect(j.divide(3)(6)).toBe(2);
        });
        
        it('should divide first by second when called in standard fashion', function () {
            expect(j.divide(6, 3)).toBe(2);
        });
        
    });
    
    describe('mod', function () {
        
        it('should take mod of second number by first when called as a curried function', function () {
            expect(j.mod(2)(5)).toBe(1);
        });
        
        it('should take mod of first by second when called in standard fashion', function () {
            expect(j.mod(5, 2)).toBe(1);
        });
        
    });
    
    describe('range', function () {
        
        it('should produce a range from 1 to n', function () {
            expect(JSON.stringify(j.range(5))).toBe('[1,2,3,4,5]');
        });
        
        it('should produce a range from -5 to n', function () {
            expect(JSON.stringify(j.range(-5, 5))).toBe('[-5,-4,-3,-2,-1,0,1,2,3,4,5]');
        });
        
        it('should produce a range with an interval', function () {
            expect(JSON.stringify(j.range(1, 5, 2))).toBe('[1,3,5]');
        });
        
    });
    
});