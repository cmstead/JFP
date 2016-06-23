var j = require('../../dist/jfp.min');

describe('jfp array', function () {

    describe('nth', function () {

        it('should return the nth value of an array', function () {
            expect(j.nth(1)([1, 2, 3, 4])).toBe(2);
        });

        it('should return nil if value is undefined', function () {
            var result = j.nth(1)([]);
            expect(j.isTypeOf('nil')(result)).toBe(true);
        });

    });

    describe('first', function () {

        it('should return first element of an array', function () {
            expect(j.first([1, 2, 3])).toBe(1);
        });

        it('should return nil if first element does not exist', function () {
            var result = j.first([]);
            expect(j.isTypeOf('nil')(result)).toBe(true);
        });

    });

    describe('rest', function () {

        it('should return a new array without the first element', function () {
            var result = j.rest([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[2,3,4]');
        });

    });

    describe('lastIndexOf', function () {

        it('should return final index of an array', function () {
            expect(j.lastIndexOf([1, 2, 3, 4])).toBe(3);
        });

        it('should return correct final index of an array', function () {
            expect(j.lastIndexOf([])).toBe(0);
        });

    });

    describe('take', function () {

        it('should take the first 1 elements', function () {
            var result = j.take(1)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[1]');
        });

        it('should take the all elements if length is too big', function () {
            var result = j.take(9)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[1,2,3,4]');
        });

    });

    describe('dropNth', function () {

        it('should drop 0th element', function () {
            var result = j.dropNth(0)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[2,3,4]');
        });

        it('should drop 3rd element', function () {
            var result = j.dropNth(2)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[1,2,4]');
        });

    });

    describe('reverse', function () {

        it('should return a reversed array', function () {
            var result = j.reverse([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[4,3,2,1]');
        });

        it('should not reverse array in place', function () {
            var original = [1, 2, 3, 4];
            var result = j.reverse(original);
            expect(JSON.stringify(original)).toBe('[1,2,3,4]');
        });

    });

    describe('foldl', function () {

        function add(a, b) {
            return a + b;
        }

        it('should add no values', function () {
            expect(j.foldl(add, 0)([])).toBe(0);
        });

        it('should add the initial value and a single value', function () {
            expect(j.foldl(add, 0)([1])).toBe(1);
        });

        it('should add the initial value and multiple values', function () {
            expect(j.foldl(add)([1, 2, 3, 4])).toBe(10);
        });

    });

    describe('foldr', function () {

        function reverseDivide(a, b) {
            return b / (a + 1);
        }

        it('should fold from right to left', function () {
            expect(j.foldr(reverseDivide, 1)([12, 36, 6, 2])).toBe(1.2);
        });

    });

    describe('filter', function () {

        var isInt = j.isTypeOf('int');

        it('should remove all non-integer values', function () {
            var result = j.filter(isInt)([1.2, 3, 4.4, 5, 6]);
            expect(JSON.stringify(result)).toBe('[3,5,6]');
        });

    });

    describe('map', function () {

        function triple(value) {
            return value * 3;
        }

        it('should triple all values', function () {
            var result = j.map(triple)([1, 2, 3, 4]);
            expect(JSON.stringify(result)).toBe('[3,6,9,12]');
        });

    });

    describe('rreduce', function () {

        it('should add all values in a 1D array', function () {
            expect(j.rreduce(j.add)([1, 2, 3, 4])).toBe(10);
        });

        it('should add all values with an initial value', function () {
            expect(j.rreduce(j.add, 5)([3, 4, 5, 6])).toBe(23);
        });

        it('should add all values in a nested list', function () {
            expect(j.rreduce(j.add)([3, [4, [5, 6]]])).toBe(18);
        });

    });

    describe('rfilter', function () {
        
        var isEven = j.compose(j.equal(0), j.modBy(2));

        it('should filter recursively and return a flat array', function () {
            var result = j.rfilter(isEven)([1, 2, [3, 4, [5, 6, 7]]]);
            expect(JSON.stringify(result)).toBe('[2,4,6]');
        });

    });

    describe('rmap', function () {
        
        it('should filter recursively and return a flat array', function () {
            var result = j.rmap(j.multiplyBy(3))([1, 2, [3, 4, [5, 6, 7]]]);
            expect(JSON.stringify(result)).toBe('[3,6,9,12,15,18,21]');
        });

    });

    describe('some', function () {

        var isInt = j.isTypeOf('int');

        it('should return true if array contains an element which matches predicate', function () {
            expect(j.some(isInt)([1, 2, 3, 4])).toBe(true);
        });

        it('should return false if array contains no an element which matches predicate', function () {
            expect(j.some(isInt)([1.1, 2.2, 3.3, 4.4])).toBe(false);
        });

    });

    describe('none', function () {

        var isInt = j.isTypeOf('int');

        it('should return false if array contains an element which matches predicate', function () {
            expect(j.none(isInt)([1, 2, 3, 4])).toBe(false);
        });

        it('should return true if array contains no an element which matches predicate', function () {
            expect(j.none(isInt)([1.1, 2.2, 3.3, 4.4])).toBe(true);
        });

    });

    describe('all', function () {

        var isInt = j.isTypeOf('int');

        it('should return true if all elements of array match predicate', function () {
            expect(j.all(isInt)([1, 2, 3, 4])).toBe(true);
        });

        it('should return true if no elements of array match predicate', function () {
            expect(j.all(isInt)([1.1, 2.2, 3.3, 4.4])).toBe(false);
        });

        it('should return true if some, but not all elements of array match predicate', function () {
            expect(j.all(isInt)([1.1, 2, 3.3, 4.4])).toBe(false);
        });

    });

    describe('find', function () {

        var isEven = j.compose(j.equal(0), j.modBy(2));

        it('should return a found element', function () {
            expect(j.find(isEven)([1, 2, 3, 4])).toBe(2);
        });

        it('should return nil if no element is found', function () {
            var result = j.find(isEven)([1, 3, 5, 7]);
            expect(j.isTypeOf('nil')(result)).toBe(true);
        });

    });

    describe('compact', function () {

        it('should remove all falsey values from an array', function () {
            expect(JSON.stringify(j.compact([1, 2, 0, false, '', null, 3]))).toBe('[1,2,3]');
        });

    });

    describe('sort', function () {
        it('should sort using standard sort', function () {
            var result = j.sort()([2, 3, 1, 5, 4]);
            expect(JSON.stringify(result)).toBe('[1,2,3,4,5]');
        });

        it('should sort using standard sort', function () {
            var result = j.sort(j.reverseArgs(j.subtract))([2, 3, 1, 5, 4]);
            expect(JSON.stringify(result)).toBe('[5,4,3,2,1]');
        });
    });

});