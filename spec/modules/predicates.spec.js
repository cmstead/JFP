var j = require('../../dist/jfp.min');

describe('jfp predicates', function () {
    
    describe('equal', function () {
        
        it('should return true when two values are equal', function () {
            expect(j.equal(10)(10)).toBe(true);
        });
        
        it('should return false when two values are not equal', function () {
            expect(j.equal(10)(12)).toBe(false);
        });
        
    });
    
    describe('not', function () {
        
        it('should return false when passed true', function () {
            expect(j.not(true)).toBe(false);
        });
        
        it('should return true when passed false', function () {
            expect(j.not(false)).toBe(true);
        });
        
    });
    
    describe('and', function () {
        
        it('should perform a positive conjunction', function () {
            expect(j.and(true)(true)).toBe(true);
            expect(j.and(5)('foo')).toBe(true);
        });
        
        it('should perform a negative conjunction', function () {
            expect(j.and(true)(false)).toBe(false);
            expect(j.and(5)('')).toBe(false);
        });
        
    });
    
    describe('or', function () {
        
        it('should perform a positive disjunction', function () {
            expect(j.or(true)(false)).toBe(true);
            expect(j.or(5)('')).toBe(true);
        });
        
        it('should perform a negative disjunction', function () {
            expect(j.or(false)(false)).toBe(false);
            expect(j.or(0)('')).toBe(false);
        });
        
    });
    
    describe('xor', function () {
        
        it('should perform a positive exclusive or behavior', function () {
            expect(j.xor(true)(false)).toBe(true);
            expect(j.xor(5)('')).toBe(true);
        });
        
        it('should perform a negative exclusive or behavior', function () {
            expect(j.xor(true)(true)).toBe(false);
            expect(j.xor(false)(false)).toBe(false);
            expect(j.xor(0)('')).toBe(false);
        });
        
    });
    
});