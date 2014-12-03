(function(){

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

    describe('cons', function(){

        it('should return an empty array when no arguments are passed', function(){
            expect(JSON.stringify(j.cons())).toBe('[]');
        });

        it('should return an array of one element if only a single element is passed', function(){
            expect(JSON.stringify(j.cons(5))).toBe('[5]');
        });

        it('should return an array containing the first argument and the rest of a second array', function(){
            var testArray = [1, 2, 3, 4],
                returnedArray = j.cons(5, testArray);

            expect(JSON.stringify(returnedArray)).toBe('[5,1,2,3,4]');
        });

    });

})();