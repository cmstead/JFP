var j = require('../../dist/jfp.min');
var timer = require('../timer/test-timer')();

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
            expect(j.add(5, 6)).toBe(11);
        });

        it('should subtract two numbers second when called normally', function () {
            expect(j.subtract(5, 6)).toBe(-1);
        });

        it('should multiply two numbers as a standard function call', function () {
            expect(j.multiply(5, 6)).toBe(30);
        });

        it('should divide first by second when called in standard fashion', function () {
            expect(j.divide(6, 3)).toBe(2);
        });

        it('should take mod of first by second when called in standard fashion', function () {
            expect(j.mod(5, 2)).toBe(1);
        });

    });

    describe('curried arithmetic', function () {

        it('should add two numbers with a standard call', function () {
            expect(j.addBy(5)(6)).toBe(11);
        });

        it('should subtract two numbers second when called normally', function () {
            expect(j.subtractBy(5)(6)).toBe(1);
        });

        it('should multiply two numbers as a standard function call', function () {
            expect(j.multiplyBy(5)(6)).toBe(30);
        });

        it('should divide first by second when called in standard fashion', function () {
            expect(j.divideBy(3)(6)).toBe(2);
        });

        it('should take mod of first by second when called in standard fashion', function () {
            expect(j.modBy(5)(2)).toBe(2);
        });

    });

    describe('range', function () {

        it('should produce a range from 1 to n', function () {
            expect(JSON.stringify(j.range(1)(5))).toBe('[1,2,3,4,5]');
        });

        it('should produce a range from -5 to n', function () {
            expect(JSON.stringify(j.range(-5)(5))).toBe('[-5,-4,-3,-2,-1,0,1,2,3,4,5]');
        });

        it('should produce a range with an interval', function () {
            expect(JSON.stringify(j.range(1, 2)(5))).toBe('[1,3,5]');
        });

    });

    describe('min', function () {

        it('should find the min of two numbers', function () {
            expect(j.min(1, 2)).toBe(1);
            expect(j.min(2, 1)).toBe(1);
        });

    });

    describe('max', function () {

        it('should find the max of two numbers', function () {
            expect(j.max(1, 2)).toBe(2);
            expect(j.max(3, 1)).toBe(3);
        });

    });

    describe('inc', function () {

        it('should increment a number', function () {
            expect(j.inc(5)).toBe(6);
        });

    });

    describe('dec', function () {

        it('should decrement a number', function () {
            expect(j.dec(5)).toBe(4);
        });

    });

    describe('comparison', function () {

        it('should perform greater than comparison', function () {
            expect(j.gt(5)(4)).toBe(true);
            expect(j.gt(5)(6)).toBe(false);
        });

        it('should perform greater than ore equal comparison', function () {
            expect(j.geq(5)(4)).toBe(true);
            expect(j.geq(5)(5)).toBe(true);
            expect(j.geq(5)(6)).toBe(false);
        });

        it('should perform less than comparison', function () {
            expect(j.lt(5)(4)).toBe(false);
            expect(j.lt(5)(6)).toBe(true);
        });

        it('should perform less than or equal comparison', function () {
            expect(j.leq(5)(4)).toBe(false);
            expect(j.leq(5)(5)).toBe(true);
            expect(j.leq(5)(6)).toBe(true);
        });

        it('should perform between comparison', function () {
            expect(j.between(1, 10)(4)).toBe(true);
            expect(j.between(1, 10)(1)).toBe(true);
            expect(j.between(1, 10)(10)).toBe(true);
            expect(j.between(1, 10)(-5)).toBe(false);
            expect(j.between(1, 10)(15)).toBe(false);
            expect(j.between.bind(null, 6, 5)).toThrow();
        });

    });

});