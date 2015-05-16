var jfp = require('../../dist/jfp.js'),
    j = jfp;

describe('math predicate', function(){

    describe('isEven', function(){

        it('should return true if number is even', function(){
            expect(j.isEven(2)).toBe(true);
        });

        it('should return false if number is odd', function(){
            expect(j.isEven(3)).toBe(false);
        });

    });

    describe('isOdd', function(){

        it('should return true if number is odd', function(){
            expect(j.isOdd(3)).toBe(true);
        });

        it('should return false if number is even', function(){
            expect(j.isOdd(2)).toBe(false);
        });

    });

    describe('isPositive', function(){

        it('should return true if number is positive', function(){
            expect(j.isPositive(3)).toBe(true);
        });

        it('should return false if number is negative', function(){
            expect(j.isPositive(-3)).toBe(false);
        });

        it('should return false if number is 0', function(){
            expect(j.isPositive(0)).toBe(false);
        });

    });

    describe('isNegative', function(){

        it('should return true if number is negative', function(){
            expect(j.isNegative(-3)).toBe(true);
        });

        it('should return false if number is positive', function(){
            expect(j.isNegative(3)).toBe(false);
        });

        it('should return false if number is 0', function(){
            expect(j.isPositive(0)).toBe(false);
        });

    });

    describe('isZero', function(){

        it('should return true if value is zero', function(){
            expect(j.isZero(0)).toBe(true);
        });

        it('should return false if value is not zero', function(){
            expect(j.isZero(1)).toBe(false);
        });

    });

    describe('isNonZero', function(){

        it('should return true if value is negative', function(){
            expect(j.isNonZero(-1)).toBe(true);
        });

        it('should return true if value is positive', function(){
            expect(j.isNonZero(1)).toBe(true);
        });

        it('should return false if value is 0', function(){
            expect(j.isNonZero(0)).toBe(false);
        });

    });

    describe('isNonPositive', function(){

        it('should return true if value is 0', function(){
            expect(j.isNonPositive(0)).toBe(true);
        });

        it('should return true if value is negative', function(){
            expect(j.isNonPositive(-1)).toBe(true);
        });

        it('should return false if value is positive', function(){
            expect(j.isNonPositive(1)).toBe(false);
        });

    });

    describe('isNonNegative', function(){

        it('should return true if value is 0', function(){
            expect(j.isNonNegative(0)).toBe(true);
        });

        it('should return true if value is positive', function(){
            expect(j.isNonNegative(1)).toBe(true);
        });

        it('should return false if value is negative', function(){
            expect(j.isNonNegative(-1)).toBe(false);
        });

    });

    describe('isInt', function(){

        it('should return true if passed value is an integer', function(){
            expect(j.isInt(5)).toBe(true);
        });

        it('should return false if passed value is not an integer', function(){
            expect(j.isInt(3.4)).toBe(false);
        });

    });



    //Special case predicates -- intentionally not named with 'is'
    describe('equal', function(){

        it('should return falseif less than two values provided', function(){
            expect(j.equal()).toBe(false);
        });

        it('should return true if both values are equal', function(){
            expect(j.equal(0, 0)).toBe(true);
        });

        it('should return false if both values are not equal', function(){
            expect(j.equal(0, 1)).toBe(false);
        });

    });

    describe('less', function(){

        it('should throw if two values are not provided', function(){
            function testLess(){
                j.less();
            }

            expect(testLess).toThrow();
        });

        it('should return true if first value is less than second', function(){
            expect(j.less(1, 2)).toBe(true);
        });

        it('should return false if first value is greater than or equal to second', function(){
            expect(j.less(2, 1)).toBe(false);
        });

    });

    describe('greater', function(){

        it('should throw if two values are not provided', function(){
            function testGreater(){
                j.greater();
            }

            expect(testGreater).toThrow();
        });

        it('should return true if first value is greater than second', function(){
            expect(j.greater(2, 1)).toBe(true);
        });

        it('should return false if first value is less than second', function(){
            expect(j.greater(1, 2)).toBe(false);
        });

    });

    describe('leq', function(){

        it('should return true if values satisfy less', function(){
            expect(j.leq(1, 2)).toBe(true);
        });

        it('should return false if values satisfy greater', function(){
            expect(j.leq(2, 1)).toBe(false);
        });

        it('should return true if values satisfy equal', function(){
            expect(j.leq(1, 1)).toBe(true);
        });

    });

    describe('geq', function(){

        it('should return true if values satisfy greater', function(){
            expect(j.geq(2, 1)).toBe(true);
        });

        it('should return false if values satisfy less', function(){
            expect(j.geq(1, 2)).toBe(false);
        });

        it('should return true if values satisfy equal', function(){
            expect(j.geq(1, 1)).toBe(true);
        });

    });

});
