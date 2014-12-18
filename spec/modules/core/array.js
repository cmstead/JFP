(function(){
    'use strict';

    describe('concat', function(){

        it('should return an array', function(){
            expect(JSON.stringify(j.concat())).toBe('[]');
        });

        it('should return a matching array when called with one array', function(){
            expect(JSON.stringify(j.concat([1, 2, 3]))).toBe('[1,2,3]');
        });

        it('should return two arrays, concatenated', function(){
            expect(JSON.stringify(j.concat([1, 2], [3, 4]))).toBe('[1,2,3,4]');
        });

    });

    describe('slice', function(){

        it('should return an array', function(){
            expect(JSON.stringify(j.slice())).toBe('[]');
        });

        it('should return array matching original when slicing at 0', function(){
            expect(JSON.stringify(j.slice(0, [1, 2, 3, 4]))).toBe('[1,2,3,4]');
        });

        it('should return a copy of the original array', function(){
            var testArray = [1, 2, 3, 4];
            expect(j.slice(0, testArray)).not.toBe(testArray);
        });

        it('should slice the first n objects off passed array', function(){
            expect(JSON.stringify(j.slice(2, [1, 2, 3, 4]))).toBe('[3,4]');
        });

        it('should slice the first n objects of passed array and return m objects', function(){
            expect(JSON.stringify(j.slice(1, [1, 2, 3, 4, 5, 6], 4))).toBe('[2,3,4]');
        });

    });

})();