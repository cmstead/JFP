var j = require('../../dist/jfp.min');
var sinon = require('sinon');
var timer = require('../timer/test-timer')();
var assert = require('chai').assert;

describe('jfp core', function () {

    beforeEach(function () {
        timer.setMaxAcceptableTime(0.5);
        timer.reset();
        timer.start();
    });

    afterEach(function () {
        timer.stop();
        timer.report();
    });

    describe('maybe', function () {

        var isNull = j.isTypeOf('null');

        it('should return null if value is not a type match', function () {
            var result = j.maybe('number')('foo');

            assert.equal(isNull(result), true);
        });

        it('should return value if value is a type match', function () {
            var result = j.maybe('string')('foo');

            assert.equal(result, 'foo');
        });

        it('should take a predicate function in place of a type', function () {
            var isEven = j.compose(j.equal(0), j.modBy(2));

            assert.equal(isNull(j.maybe(isEven)(3)), true);
            assert.equal(j.maybe(isEven)(4), 4);
        });

    });

    describe('either', function () {

        it('should return value if value matches type', function () {
            assert.equal(j.either('number')(0)(42), 42);
        });

        it('should return default value if value does not match type', function () {
            assert.equal(j.either('number')(0)('foo'), 0);
        });

        it('should take a predicate function in place of a type', function () {
            var isEven = j.compose(j.equal(0), j.modBy(2));
            assert.equal(j.either(isEven)(0)(3), 0);
            assert.equal(j.either(isEven)(0)(4), 4);
        });

    });

    describe('identity', function () {

        it('should return passed value', function () {
            assert.equal(j.identity('foo'), 'foo');
        });

    });

    describe('always', function () {

        it('should return bound value ', function () {
            assert.equal(j.always('foo')(), 'foo');
        });

    });

    describe('cons', function () {

        it('should return new array with value prepended', function () {
            var result = j.cons(1, [2, 3, 4]);
            assert.equal(JSON.stringify(result), '[1,2,3,4]');
        });

        it('should return new array without undefined prepended', function () {
            var result = j.cons(undefined, [2, 3, 4]);
            assert.equal(JSON.stringify(result), '[2,3,4]');
        });

    });

    describe('conj', function () {

        it('should return new array with value prepended', function () {
            var result = j.conj(1, [2, 3, 4]);
            assert.equal(JSON.stringify(result), '[2,3,4,1]');
        });

        it('should return new array without undefined prepended', function () {
            var result = j.conj(undefined, [2, 3, 4]);
            assert.equal(JSON.stringify(result), '[2,3,4]');
        });

    });

    describe('slice', function () {

        it('should slice starting at an initial index', function () {
            var result = j.slice(1)([1, 2, 3, 4]);
            assert.equal(JSON.stringify(result), '[2,3,4]');
        });

        it('should slice slice from index to length', function () {
            var result = j.slice(1, 3)([1, 2, 3, 4]);
            assert.equal(JSON.stringify(result), '[2,3]');
        });

    });

    describe('recur', function () {

        function fac(recur, n, current) {
            var result = typeof current !== 'undefined' ? current : 1;
            return n === 0 ? result : recur(n - 1, result * n);
        }

        it('should evaluate fac 0 correctly', function () {
            assert.equal(j.recur(fac)(0), 1);
        });

        it('should evaluate fac 1 correctly', function () {
            assert.equal(j.recur(fac)(1), 1);
        });

        it('should evaluate fac 2 correctly', function () {
            assert.equal(j.recur(fac)(2), 2);
        });

        it('should evaluate fac 30 correctly', function () {
            assert.equal(j.recur(fac)(30), 2.652528598121911e+32);
        });

    });

    function inc(value) {
        return value + 1;
    }

    function multiplyBy(n) {
        return function (m) {
            return n * m;
        };
    }

    describe('compose', function () {

        it('should compose two functions', function () {
            var compute = j.compose(inc, multiplyBy(2));

            assert.equal(compute(5), 11);
        });
    });

    describe('foldlCompose', function () {

        it('should compose multiple functions', function () {
            var compute = j.foldlCompose(inc, multiplyBy(3), multiplyBy(1/2));

            assert.equal(compute(6), 10);
        });
    });

    describe('rcompose', function () {

        it('should compose two functions in reading order', function () {
            var compute = j.rcompose(inc, multiplyBy(2));

            assert.equal(compute(5), 12);
        });
    });

    describe('foldrCompose', function () {

        it('should compose multiple functions in reading order', function () {
            var compute = j.foldrCompose(inc, multiplyBy(3), multiplyBy(1/2));

            assert.equal(compute(6), 10.5);
        });
    });

    describe('curry', function () {

        function add3Vals(a, b, c) {
            return a + b + c;
        }

        it('should return a function which can be called as usual', function () {
            assert.equal(j.curry(add3Vals)(1, 2, 3), 6);
        });

        it('should return a curried function', function () {
            assert.equal(j.curry(add3Vals)(1)(2)(4), 7);
            assert.equal(j.curry(add3Vals)(1, 2)(5), 8);
            assert.equal(j.curry(add3Vals)(1)(2, 6), 9);
            assert.equal(j.curry(add3Vals)()()()(1)(2, 4), 7);
        });

        it('should curry to a specified length', function () {
            assert.equal(typeof j.curry(add3Vals, 4)(1, 2, 3), 'function');
            assert.equal(typeof j.curry(add3Vals, 4)(1, 2, 3, 4), 'number');
        });

    });

    describe('partial', function () {

        function add(a, b) {
            return a + b;
        }

        it('should partially apply arguments to a function', function () {
            assert.equal(j.partial(add, 5, 6)(), 11);
            assert.equal(j.partial(add, 6)(7), 13);
            assert.equal(j.partial(add)(7, 8), 15);
        });

    });

    describe('rpartial', function () {

        function divide(a, b) {
            return a / b;
        }

        function truncate(value) {
            return Math.floor(value * 1000) / 1000;
        }

        it('should partially apply arguments to a function from right to left', function () {
            assert.equal(j.rpartial(divide, 6, 12)(), 0.5);
            assert.equal(j.rpartial(divide, 3)(12), 4);
            assert.equal(truncate(j.rpartial(divide)(4, 12)), 0.333);
        });

    });

    describe('repeat', function () {

        it('should repeat an operation one time', function () {
            var callCount = 0;

            function spy() {
                callCount++;
            }

            j.repeat(spy)(1)();

            assert.equal(callCount, 1);
        });

        it('should repeat an operation multiple times', function () {
            var callCount = 0;

            function spy() {
                callCount++;
            }

            j.repeat(spy)(5)();

            assert.equal(callCount, 5);
        });

        it('should repeat with previous result', function () {
            function repeatStr(astr) {
                return function (count) {
                    return j.repeat(j.concat(astr))(count)('');
                };
            }

            assert.equal(j.repeat(j.inc)(5)(2), 7);
            assert.equal(repeatStr('a')(5), 'aaaaa');
        });

    });

});

if(typeof global.runQuokkaMochaBdd === 'function') {
    runQuokkaMochaBdd();
}
