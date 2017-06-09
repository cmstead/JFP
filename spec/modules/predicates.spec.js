var j = require('../../dist/jfp.min');
var timer = require('../timer/test-timer')();
var assert = require('chai').assert;

describe('jfp predicates', function () {

    beforeEach(function () {
        timer.reset();
        timer.start();
    });

    afterEach(function () {
        timer.stop();
        timer.report();
    });


    describe('equal', function () {

        it('should return true when two values are equal', function () {
            assert.equal(j.equal(10)(10), true);
        });

        it('should return false when two values are not equal', function () {
            assert.equal(j.equal(10)(12), false);
        });

    });

    describe('not', function () {

        it('should return false when passed true', function () {
            assert.equal(j.not(true), false);
        });

        it('should return true when passed false', function () {
            assert.equal(j.not(false), true);
        });

    });

    describe('and', function () {

        it('should perform a positive conjunction', function () {
            assert.equal(j.and(true)(true), true);
            assert.equal(j.and(5)('foo'), true);
        });

        it('should perform a negative conjunction', function () {
            assert.equal(j.and(true)(false), false);
            assert.equal(j.and(5)(''), false);
        });

    });

    describe('or', function () {

        it('should perform a positive disjunction', function () {
            assert.equal(j.or(true)(false), true);
            assert.equal(j.or(5)(''), true);
        });

        it('should perform a negative disjunction', function () {
            assert.equal(j.or(false)(false), false);
            assert.equal(j.or(0)(''), false);
        });

    });

    describe('xor', function () {

        it('should perform a positive exclusive or behavior', function () {
            assert.equal(j.xor(true)(false), true);
            assert.equal(j.xor(5)(''), true);
        });

        it('should perform a negative exclusive or behavior', function () {
            assert.equal(j.xor(true)(true), false);
            assert.equal(j.xor(false)(false), false);
            assert.equal(j.xor(0)(''), false);
        });

    });

});

if(typeof global.runQuokkaMochaBdd === 'function') {
    runQuokkaMochaBdd();
}
