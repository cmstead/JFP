var j = require('../../dist/jfp');
var timer = require('../timer/test-timer')();
var signet = require('signet')();
var assert = require('chai').assert;

describe('jfp array', function () {

    beforeEach(function () {
        timer.reset();
        timer.start();
    });

    afterEach(function () {
        timer.stop();
        timer.report();
    });

    describe('nth', function () {

        it('should return the nth value of an array', function () {
            var nth = j.nth;
            var values = [1, 2, 3, 4];

            var result = nth(1)(values);

            assert.equal(result, 2);
        });

        it('should return null if value is undefined', function () {
            var result = j.nth(1)([]);

            assert.equal(j.isTypeOf('null')(result), true);
        });

    });

    describe('first', function () {

        it('should return first element of an array', function () {
            assert.equal(j.first([1, 2, 3]), 1);
        });

        it('should return null if first element does not exist', function () {
            var result = j.first([]);
            assert.equal(j.isTypeOf('null')(result), true);
        });

    });

    describe('rest', function () {

        it('should return a new array without the first element', function () {
            var result = j.rest([1, 2, 3, 4]);
            assert.equal(JSON.stringify(result), '[2,3,4]');
        });

    });

    describe('lastIndexOf', function () {

        it('should return final index of an array', function () {
            assert.equal(j.lastIndexOf([1, 2, 3, 4]), 3);
        });

        it('should return correct final index of an array', function () {
            assert.equal(j.lastIndexOf([]), 0);
        });

    });

    describe('take', function () {

        it('should take the first 1 elements', function () {
            var result = j.take(1)([1, 2, 3, 4]);
            assert.equal(JSON.stringify(result), '[1]');
        });

        it('should take the all elements if length is too big', function () {
            var result = j.take(9)([1, 2, 3, 4]);
            assert.equal(JSON.stringify(result), '[1,2,3,4]');
        });

    });

    describe('takeUntil', function () {

        it('should take elements until it hits an even number', function () {
            var isEven = j.compose(j.equal(0), j.modBy(2));
            var result = j.takeUntil(isEven)([1, 3, 5, 6, 7, 8, 9]);

            assert.equal(JSON.stringify(result), '[1,3,5]');
        });

        it('should take all elements if predicate is never satisfied', function () {
            var isEven = j.compose(j.equal(0), j.modBy(2));
            var result = j.takeUntil(isEven)([1, 3, 5, 7, 9]);

            assert.equal(JSON.stringify(result), '[1,3,5,7,9]');
        });
    });

    describe('dropNth', function () {

        it('should drop 0th element', function () {
            var result = j.dropNth(0)([1, 2, 3, 4]);
            assert.equal(JSON.stringify(result), '[2,3,4]');
        });

        it('should drop 3rd element', function () {
            var result = j.dropNth(2)([1, 2, 3, 4]);
            assert.equal(JSON.stringify(result), '[1,2,4]');
        });

    });

    describe('reverse', function () {

        it('should return a reversed array', function () {
            var result = j.reverse([1, 2, 3, 4]);
            assert.equal(JSON.stringify(result), '[4,3,2,1]');
        });

        it('should not reverse array in place', function () {
            var original = [1, 2, 3, 4];
            var result = j.reverse(original);
            assert.equal(JSON.stringify(original), '[1,2,3,4]');
        });

    });

    describe('foldl', function () {

        function add(a, b) {
            return a + b;
        }

        it('should add no values', function () {
            assert.equal(j.foldl(add, 0)([]), 0);
        });

        it('should add the initial value and a single value', function () {
            assert.equal(j.foldl(add, 0)([1]), 1);
        });

        it('should add the initial value and multiple values', function () {
            assert.equal(j.foldl(add)([1, 2, 3, 4]), 10);
        });

    });

    describe('foldr', function () {

        function reverseDivide(a, b) {
            return b / (a + 1);
        }

        it('should fold from right to left', function () {
            assert.equal(j.foldr(reverseDivide, 1)([12, 36, 6, 2]), 1.2);
        });

    });

    describe('filter', function () {

        var isInt = j.isTypeOf('int');

        it('should remove all non-integer values', function () {
            var result = j.filter(isInt)([1.2, 3, 4.4, 5, 6]);
            assert.equal(JSON.stringify(result), '[3,5,6]');
        });

    });

    describe('map', function () {

        function triple(value) {
            return value * 3;
        }

        it('should triple all values', function () {
            var result = j.map(triple)([1, 2, 3, 4]);
            assert.equal(JSON.stringify(result), '[3,6,9,12]');
        });

    });

    describe('rreduce', function () {

        it('should add all values in a 1D array', function () {
            assert.equal(j.rreduce(j.add)([1, 2, 3, 4]), 10);
        });

        it('should add all values with an initial value', function () {
            assert.equal(j.rreduce(j.add, 5)([3, 4, 5, 6]), 23);
        });

        it('should add all values in a nested list', function () {
            assert.equal(j.rreduce(j.add)([3, [4, [5, 6]]]), 18);
        });

    });

    describe('rfilter', function () {

        var isEven = j.compose(j.equal(0), j.modBy(2));

        it('should filter recursively and return a flat array', function () {
            var result = j.rfilter(isEven)([1, 2, [3, 4, [5, 6, 7]]]);
            assert.equal(JSON.stringify(result), '[2,4,6]');
        });

    });

    describe('rmap', function () {

        it('should filter recursively and return a flat array', function () {
            var result = j.rmap(j.multiplyBy(3))([1, 2, [3, 4, [5, 6, 7]]]);
            assert.equal(JSON.stringify(result), '[3,6,9,12,15,18,21]');
        });

    });

    describe('some', function () {

        var isInt = j.isTypeOf('int');

        it('should return true if array contains an element which matches predicate', function () {
            assert.equal(j.some(isInt)([1, 2, 3, 4]), true);
        });

        it('should return false if array contains no an element which matches predicate', function () {
            assert.equal(j.some(isInt)([1.1, 2.2, 3.3, 4.4]), false);
        });

    });

    describe('none', function () {

        var isInt = j.isTypeOf('int');

        it('should return false if array contains an element which matches predicate', function () {
            assert.equal(j.none(isInt)([1, 2, 3, 4]), false);
        });

        it('should return true if array contains no an element which matches predicate', function () {
            assert.equal(j.none(isInt)([1.1, 2.2, 3.3, 4.4]), true);
        });

    });

    describe('all', function () {

        var isInt = j.isTypeOf('int');

        it('should return true if all elements of array match predicate', function () {
            assert.equal(j.all(isInt)([1, 2, 3, 4]), true);
        });

        it('should return false if no elements of array match predicate', function () {
            assert.equal(j.all(isInt)([1.1, 2.2, 3.3, 4.4]), false);
        });

        it('should return false if some, but not all elements of array match predicate', function () {
            assert.equal(j.all(isInt)([1.1, 2, 3.3, 4.4]), false);
        });

    });

    describe('find', function () {

        var isEven = j.compose(j.equal(0), j.modBy(2));

        it('should return a found element', function () {
            assert.equal(j.find(isEven)([1, 2, 3, 4]), 2);
        });

        it('should return null if no element is found', function () {
            var result = j.find(isEven)([1, 3, 5, 7]);
            assert.equal(result, null);
        });

    });

    describe('compact', function () {

        it('should remove all falsey values from an array', function () {
            assert.equal(JSON.stringify(j.compact([1, 2, 0, false, '', null, 3])), '[1,2,3]');
        });

    });

    describe('sort', function () {
        it('should sort using standard sort', function () {
            var result = j.sort()([2, 3, 1, 5, 4]);
            assert.equal(JSON.stringify(result), '[1,2,3,4,5]');
        });

        it('should sort using standard sort', function () {
            var result = j.sort(j.reverseArgs(j.subtract))([2, 3, 1, 5, 4]);
            assert.equal(JSON.stringify(result), '[5,4,3,2,1]');
        });
    });

    describe('partition', function () {

        it('should partition array on predicate', function () {
            var isEven = j.compose(j.equal(0), j.modBy(2));
            var result = j.partition(isEven)([1, 2, 3, 4]);
            assert.equal(JSON.stringify(result), '[[2,4],[1,3]]');
        });

    });

    describe('rpartition', function () {

        it('should partition array on predicate', function () {
            var isEven = j.compose(j.equal(0), j.modBy(2));
            var result = j.rpartition(isEven)([1, [2, [3, [4]]]]);
            assert.equal(JSON.stringify(result), '[[2,4],[1,3]]');
        });

    });

});

if(typeof global.runQuokkaMochaBdd === 'function') {
    runQuokkaMochaBdd();
}
