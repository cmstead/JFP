var j = require('../../dist/jfp');

describe('JFP math', function () {
    
    describe('add', function () {
        
        it('should add two numbers, in a curried way', function () {
            expect(j.add(5)(6)).toBe(11);
        });
        
        it('should add two numbers, in a standard way', function () {
            expect(j.add(5, 6)).toBe(11);
        });
        
    });
    
    describe('subtract', function () {
        
        it('should subtract two numbers, in a curried way', function () {
            expect(j.subtract(5)(6)).toBe(-1);
        });
        
        it('should subtract two numbers, in a standard way', function () {
            expect(j.subtract(5, 6)).toBe(-1);
        });
        
    });
    
    describe('multiply', function () {
        
        it('should multiply two numbers, in a curried way', function () {
            expect(j.multiply(5)(6)).toBe(30);
        });
        
        it('should multiply two numbers, in a standard way', function () {
            expect(j.multiply(5, 6)).toBe(30);
        });
        
    });
    
    describe('divide', function () {
        
        it('should divide two numbers, in a curried way', function () {
            expect(j.divide(6)(3)).toBe(2);
        });
        
        it('should divide two numbers, in a standard way', function () {
            expect(j.divide(6, 3)).toBe(2);
        });
        
    });
    
});