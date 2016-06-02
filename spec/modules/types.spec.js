var j = require('../../dist/jfp.js');
var signet = require('signet');

describe('jfp types', function () {
    
    describe('isTypeOf', function () {
        
        it('should perform a curried type check', function () {
            expect(j.isTypeOf('array')([])).toBe(true);
        });
        
        it('should properly verify nil', function () {
            var modifiedArray = [];
            modifiedArray['foo'] = 'bar';
            
            expect(j.isTypeOf('nil')([])).toBe(true);
            expect(j.isTypeOf('nil')([1, 2, 3])).toBe(false);
            expect(j.isTypeOf('nil')(modifiedArray)).toBe(false);
        });
        
    });

    describe('nil', function () {
        
        it('Should return a nil value', function () {
            expect(j.isTypeOf('nil')(j.nil)).toBe(true);
        });
        
        it('Should return new nil value every time', function () {
            expect(j.nil).not.toBe(j.nil);
        });
        
    });
    
    describe('maybe', function () {
        
        it('should always verify nil', function () {
            expect(j.isTypeOf('maybe<number>')([])).toBe(true);
        });
        
        it('should always verify specified type', function () {
            expect(j.isTypeOf('maybe<number>')(42)).toBe(true);
        });
        
        it('should always fail on bad value', function () {
            expect(j.isTypeOf('maybe<number>')('foo')).toBe(false);
        });
        
    });
    
    describe('signet', function () {
        
        it('should verify a duck-typed signet instance', function () {
            expect(j.isTypeOf('signet')(signet())).toBe(true);
        });
        
        it('should fail a bad object', function () {
            expect(j.isTypeOf('signet')({})).toBe(false);
        });
        
    });
    
    describe('arguments', function () {
        
        it('should verify an arguments object', function () {
            expect(j.isTypeOf('arguments')(arguments)).toBe(true);
        });
        
        it('should fail on an array', function () {
            expect(j.isTypeOf('arguments')([])).toBe(false);
        });
        
    });
    
    describe('numeric', function () {
        
        it('should verify numbers', function () {
            expect(j.isTypeOf('numeric')(42)).toBe(true);
        });
        
        it('should verify numeric strings', function () {
            expect(j.isTypeOf('numeric')('1234.567')).toBe(true);
        });
        
        it('should fail non-numeric strings', function () {
            expect(j.isTypeOf('numeric')('aaa1234.567')).toBe(false);
        });
        
    });
    
});