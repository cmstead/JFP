var j = require('../../dist/jfp.js');

describe('jfp predicates', function () {
    
    describe('equal', function () {
        
        it('should return true when two values are equal', function () {
            expect(j.equal(10, 10)).toBe(true);
        });
        
        it('should return false when two values are not equal', function () {
            expect(j.equal(10, 12)).toBe(false);
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
    
});