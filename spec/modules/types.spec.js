var j = require('../../dist/jfp.min');
var signet = require('signet');
var timer = require('../timer/test-timer')();
var assert = require('chai').assert;

describe('jfp types', function () {
    
    beforeEach(function () {
        timer.reset();
        timer.start();
    });

    afterEach(function () {
        timer.stop();
        timer.report();
    });

    describe('isTypeOf', function () {
        
        it('should perform a curried type check', function () {
            assert.equal(j.isTypeOf('array')([]), true);
        });
        
    });

    describe('nil', function () {
        
        it('Should return a nil value', function () {
            assert.equal(j.isTypeOf('nil')(j.nil), true);
        });
        
        it('Should return new nil value every time', function () {
            assert.notEqual(j.nil, j.nil);
        });
        
    });
    
    describe('maybe', function () {
        
        it('should always verify null', function () {
            assert.equal(j.isTypeOf('maybe<number>')(null), true);
        });
        
        it('should always verify specified type', function () {
            assert.equal(j.isTypeOf('maybe<number>')(42), true);
        });
        
        it('should always fail on bad value', function () {
            assert.equal(j.isTypeOf('maybe<number>')('foo'), false);
        });
        
    });
    
    describe('signet', function () {
        
        it('should verify a duck-typed signet instance', function () {
            assert.equal(j.isTypeOf('signet')(signet()), true);
        });
        
        it('should fail a bad object', function () {
            assert.equal(j.isTypeOf('signet')({}), false);
        });
        
    });
    
    describe('numeric', function () {
        
        it('should verify numbers', function () {
            assert.equal(j.isTypeOf('numeric')(42), true);
        });
        
        it('should verify numeric strings', function () {
            assert.equal(j.isTypeOf('numeric')('1234.567'), true);
        });
        
        it('should fail non-numeric strings', function () {
            assert.equal(j.isTypeOf('numeric')('aaa1234.567'), false);
        });
        
    });
    
});

if(typeof global.runQuokkaMochaBdd === 'function') {
    runQuokkaMochaBdd();
}
