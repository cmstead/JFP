var j = require('../../dist/jfp.min');
var timer = require('../timer/test-timer')();
var assert = require('chai').assert;

describe('JFP math', function () {

    beforeEach(function () {
        timer.reset();
        timer.start();
    });

    afterEach(function () {
        timer.stop();
        timer.report();
    });


    describe('arithmetic', function () {

        it('should add two numbers with a standard call', function () {
            assert.equal(j.add(5, 6), 11);
        });

        it('should subtract two numbers second when called normally', function () {
            assert.equal(j.subtract(5, 6), -1);
        });

        it('should multiply two numbers as a standard function call', function () {
            assert.equal(j.multiply(5, 6), 30);
        });

        it('should divide first by second when called in standard fashion', function () {
            assert.equal(j.divide(6, 3), 2);
        });

        it('should take mod of first by second when called in standard fashion', function () {
            assert.equal(j.mod(5, 2), 1);
        });

    });

    describe('curried arithmetic', function () {

        it('should add two numbers with a standard call', function () {
            assert.equal(j.addBy(5)(6), 11);
        });

        it('should subtract two numbers second when called normally', function () {
            assert.equal(j.subtractBy(5)(6), 1);
        });

        it('should multiply two numbers as a standard function call', function () {
            assert.equal(j.multiplyBy(5)(6), 30);
        });

        it('should divide first by second when called in standard fashion', function () {
            assert.equal(j.divideBy(3)(6), 2);
        });

        it('should take mod of first by second when called in standard fashion', function () {
            assert.equal(j.modBy(5)(2), 2);
        });

    });

    describe('range', function () {

        it('should produce a range from 1 to n', function () {
            assert.equal(JSON.stringify(j.range(1)(5)), '[1,2,3,4,5]');
        });

        it('should produce a range from -5 to n', function () {
            assert.equal(JSON.stringify(j.range(-5)(5)), '[-5,-4,-3,-2,-1,0,1,2,3,4,5]');
        });

        it('should produce a range with an interval', function () {
            assert.equal(JSON.stringify(j.range(1, 2)(5)), '[1,3,5]');
        });

    });

    describe('min', function () {

        it('should find the min of two numbers', function () {
            assert.equal(j.min(1, 2), 1);
            assert.equal(j.min(2, 1), 1);
        });

    });

    describe('max', function () {

        it('should find the max of two numbers', function () {
            assert.equal(j.max(1, 2), 2);
            assert.equal(j.max(3, 1), 3);
        });

    });

    describe('inc', function () {

        it('should increment a number', function () {
            assert.equal(j.inc(5), 6);
        });

    });

    describe('dec', function () {

        it('should decrement a number', function () {
            assert.equal(j.dec(5), 4);
        });

    });

    describe('comparison', function () {

        it('should perform greater than comparison', function () {
            assert.equal(j.gt(5)(4), true);
            assert.equal(j.gt(5)(6), false);
        });

        it('should perform greater than ore equal comparison', function () {
            assert.equal(j.geq(5)(4), true);
            assert.equal(j.geq(5)(5), true);
            assert.equal(j.geq(5)(6), false);
        });

        it('should perform less than comparison', function () {
            assert.equal(j.lt(5)(4), false);
            assert.equal(j.lt(5)(6), true);
        });

        it('should perform less than or equal comparison', function () {
            assert.equal(j.leq(5)(4), false);
            assert.equal(j.leq(5)(5), true);
            assert.equal(j.leq(5)(6), true);
        });

        it('should perform between comparison', function () {
            assert.equal(j.between(1, 10)(4), true);
            assert.equal(j.between(1, 10)(1), true);
            assert.equal(j.between(1, 10)(10), true);
            assert.equal(j.between(1, 10)(-5), false);
            assert.equal(j.between(1, 10)(15), false);
            assert.throws(j.between.bind(null, 6, 5));
        });

    });

});

if(typeof global.runQuokkaMochaBdd === 'function') {
    runQuokkaMochaBdd();
}
