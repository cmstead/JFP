(function(){

    describe('copyArray', function(){

        it('should return a matching array', function(){
            expect(JSON.stringify(j.copyArray([1, 2, 3, 4]))).toBe('[1,2,3,4]');
        });

        it('should return a new array', function(){
            var testArray = [1, 2, 3, 4];

            expect(j.copyArray(testArray)).not.toBe(testArray);
        });

        it('should return an array when called with no arguments', function(){
            expect(JSON.stringify(j.copyArray())).toBe('[]');
        });

    });

    describe('conj', function(){

        it('should return an empty array when no arguments are passed', function(){
            expect(JSON.stringify(j.conj())).toBe('[]');
        });

        it('should return an array of one element if only a single value is passed', function(){
            expect(JSON.stringify(j.conj('test'))).toBe('["test"]');
        });

        it('should return an array of elements with new element appended', function(){
            expect(JSON.stringify(j.conj(4, [1, 2, 3]))).toBe('[1,2,3,4]');
        });

        it('should not alter the original array', function(){
            var myArray = [1, 2, 3];
            j.conj(4, myArray);
            expect(myArray.length).toBe(3);
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

    describe('each', function(){

        it('should return an array', function(){
            expect(JSON.stringify(j.each())).toBe('[]');
        });

        it('should call passed function with a single value', function(){
            var spy = jasmine.createSpy('callback');
            j.each(spy, [1]);
            expect(spy).toHaveBeenCalledWith(1, 0);
        });

        it('should exit if function returns false', function(){
            var spy = jasmine.createSpy('userFn');
            j.each(function(){ spy(); return false; }, [1, 2, 3, 4]);
            expect(spy.callCount).toBe(1);
        });

        it('should call passed function for each value in array', function(){
            var spy = jasmine.createSpy('userFn');
            j.each(spy, [1, 2, 3, 4]);
            expect(spy.callCount).toBe(4);
        });

    });

    describe('map', function(){

        it('should return an array', function(){
            expect(JSON.stringify(j.map())).toBe('[]');
        });

        it('should call function for each element in array argument', function(){
            var spy = jasmine.createSpy('userFn');
            j.map(spy, [1, 2, 3, 4]);
            expect(spy.callCount).toBe(4);
        });

        it('should return a function with mapped values', function(){
            var output;

            function add5(value){
                return value + 5;
            }

            expect(JSON.stringify(j.map(add5, [0, 1, 2, 3]))).toBe('[5,6,7,8]');
        });

    });

    describe('first', function(){

        it('should return null if no arguments are passed', function(){
            expect(j.first()).toBe(null);
        });

        it('should return null if first value does not exist', function(){
            expect(j.first([])).toBe(null);
        });

        it('should return the first element of an array', function(){
            expect(j.first([1, 2, 3])).toBe(1);
        });

    });

    describe('last', function(){

        it('should return null if no array is sent', function(){
            expect(j.last()).toBe(null);
        });

        it('should return the last element of an array', function(){
            expect(j.last([1, 2, 3, 4])).toBe(4);
        });

    });

    describe('lastIndex', function(){
        it('should return null if no array is passed', function(){
            expect(j.lastIndex()).toBe(null);
        });

        it('should return the last index of an array', function(){
            expect(j.lastIndex([1, 2, 3, 4])).toBe(3);
        });
    });

    describe('drop', function(){

        it('should return an array', function(){
            expect(JSON.stringify(j.drop())).toBe('[]');
        });

        it('should remove first element from passed array', function(){
            expect(JSON.stringify(j.drop(0, [1, 2, 3, 4]))).toBe('[2,3,4]');
        });

        it('shouldremove the last element from passed array', function(){
            expect(JSON.stringify(j.drop(3, [1, 2, 3, 4]))).toBe('[1,2,3]');
        });

        it('should remove a middle element from passed array', function(){
            expect(JSON.stringify(j.drop(2, [1, 2, 3, 4]))).toBe('[1,3,4]');
        });

    });

    describe('dropFirst', function(){

        it('should drop the first element', function(){
            expect(JSON.stringify(j.dropFirst([1, 2, 3, 4]))).toBe('[2,3,4]');
        });

    });

    describe('dropFirst', function(){

        it('should drop the first element', function(){
            expect(JSON.stringify(j.dropFirst([1, 2, 3, 4]))).toBe('[2,3,4]');
        });

    });

    describe('dropLast', function(){

        it('should drop the last element', function(){
            expect(JSON.stringify(j.dropLast([1, 2, 3, 4]))).toBe('[1,2,3]');
        });

    });

    describe('rest', function(){

        it('should return an array', function(){
            expect(j.isArray(j.rest())).toBe(true);
        });

        it('should return all elements of an array except the first', function(){
            expect(JSON.stringify(j.rest([1, 2, 3, 4]))).toBe('[2,3,4]');
        });

    });

    describe('reduce', function(){

        it('should return null when no argument is passed', function(){
            expect(j.reduce()).toBe(null);
        });

        it('should return null if only a function is passed', function(){
            expect(j.reduce(function(){})).toBe(null);
        });

        it('should call passed function with the first two elements of passed array', function(){
            var spy = jasmine.createSpy('userFn');
            j.reduce(spy, [1, 2, 3, 4]);
            expect(spy).toHaveBeenCalledWith(1, 2);
        });

        it('should return the value in a single-valued array', function(){
            function add(a, b){
                return a + b;
            }

            expect(j.reduce(add, [1])).toBe(1);
        });

        it('should return the reduced result of an array and a function', function(){
            function multiply(a, b){
                return a * b;
            }

            expect(j.reduce(multiply, [1, 2, 3, 4])).toBe(24);
        });

    });

    describe('take', function(){

        it('should return null if called without arguments', function(){
            expect(j.take()).toBe(null);
        });

        it('should return the first 3 elements of an array', function(){
            expect(JSON.stringify(j.take(3, [1, 2, 3, 4]))).toBe('[1,2,3]');
        });

        it('should return entire set of values if count is greater than array length', function(){
            expect(JSON.stringify(j.take(5, [1, 2, 3]))).toBe('[1,2,3]');
        });

    });

    describe('filter', function(){

        it('should return an array', function(){
            expect(j.isArray(j.filter())).toBe(true);
        });

        it('should call filter function for each element', function(){
            var spy = jasmine.createSpy('filterPredicate');
            j.filter(spy, [1, 2, 3]);
            expect(spy.callCount).toBe(3);
        });

        it('should filter array based on filter predicate', function(){
            function isEven(value){
                return value % 2 === 0;
            }

            expect(JSON.stringify(j.filter(isEven, [1, 2, 3, 4]))).toBe('[2,4]');
        });

    });

    describe('find', function(){

        it('should return null if no arguments are sent', function(){
            expect(j.find()).toBe(null);
        });

        it('should return null with just a function passed in', function(){
            expect(j.find(function(){})).toBe(null);
        });

        it('should return null if value is not found', function(){
            function isEven(value){
                return !(value & 1);
            }

            expect(j.find(isEven, [1, 3, 5, 7])).toBe(null);
        });

        it('should return first matching value', function(){
            function isEven(value){
                return !(value & 1);
            }

            expect(j.find(isEven, [1 ,2, 3, 4])).toBe(2);
        });

    });

    describe('nth', function(){
        it('should return null if no value exists at nth position', function(){
            expect(j.nth(4, [1, 2, 3])).toBe(null);
        });

        it('should return nth value of array', function(){
            expect(j.nth(1, [1, 2, 3])).toBe(2);
        });
    });

    describe('unique', function(){

        it('should return a sorted array', function(){
            expect(JSON.stringify(j.unique([5, 2, 4, 3, 1]))).toBe('[1,2,3,4,5]');
        });

        it('should remove all duplicate values', function(){
            expect(JSON.stringify(j.unique([1, 2, 3, 2, 4, 3, 3, 5]))).toBe('[1,2,3,4,5]');
        });

    });

    describe('contains', function(){

        it('should return true if array contains an element which satisfies provided predicate', function(){
            var testArray = [1, 3, 5, 6, 7];

            expect(j.contains(j.isEven, testArray)).toBe(true);
        });

        it('should return false if array does not contain an element which satisfies provided predicate', function(){
            var testArray = [1, 3, 5, 7];

            expect(j.contains(j.isEven, testArray)).toBe(false);
        });

    });

    describe('every', function(){

        it('should return true if every element of array satisfies predicate', function(){
            var testArray = [2, 4, 6, 8];

            expect(j.every(j.isEven, testArray)).toBe(true);
        });

        it('should return false if not all elements of array satisfy predicate', function(){
            var testArray = [2, 4, 5, 6, 8];

            expect(j.every(j.isEven, testArray)).toBe(false);
        });

    });

    describe('numberOf', function(){

        it('should return correct count of 1', function(){
            var testArray = [2];

            expect(j.numberOf(j.isEven, testArray)).toBe(1);
        });

        it('should return correct count of 0', function(){
            var testArray = [1, 3, 5, 7];

            expect(j.numberOf(j.isEven, testArray)).toBe(0);
        });

        it('should return correct count of 4', function(){
            var testArray = [2, 4, 6, 7, 8];

            expect(j.numberOf(j.isEven, testArray)).toBe(4);
        });

    });

    describe('sort', function(){

        it('should perform a natural sort by default', function(){
            var testArray = [3, 4, 2, 5, 1];

            expect(JSON.stringify(j.sort(testArray))).toBe('[1,2,3,4,5]');
        });

        it('should not modify the original array', function(){
            var testArray = [3, 4, 2, 5, 1];

            j.sort(testArray);

            expect(JSON.stringify(testArray)).not.toBe('[1,2,3,4,5]');
        });

        it('should sort with a sorting function', function(){
            var testArray = [{ value: 3 },
                             { value: 2 },
                             { value: 5 },
                             { value: 1 },
                             { value: 4 }],
                expectedValue = [{ value: 1 },
                                 { value: 2 },
                                 { value: 3 },
                                 { value: 4 },
                                 { value: 5 }];

            function comparator(a, b){
                var comparison = 0;

                comparison = a.value < b.value ? -1 : comparison;
                comparison = b.value < a.value ? 1 : comparison;

                return comparison;
            }

            expect(JSON.stringify(j.sort(comparator, testArray))).toBe(JSON.stringify(expectedValue));
        });

    });

    describe('contains', function(){
    
        it('should return true if array contains an element which satisfies provided predicate', function(){
            var testArray = [1, 3, 5, 6, 7];

            expect(j.contains(j.isEven, testArray)).toBe(true);
        });

        it('should return false if array does not contain an element which satisfies provided predicate', function(){
            var testArray = [1, 3, 5, 7];

            expect(j.contains(j.isEven, testArray)).toBe(false);
        });

    });

    describe('every', function(){

        it('should return true if every element of array satisfies predicate', function(){
            var testArray = [2, 4, 6, 8];

            expect(j.every(j.isEven, testArray)).toBe(true);
        });

        it('should return false if not all elements of array satisfy predicate', function(){
            var testArray = [2, 4, 5, 6, 8];

            expect(j.every(j.isEven, testArray)).toBe(false);
        });

    });

    describe('numberOf', function(){

        it('should return correct count of 1', function(){
            var testArray = [2];

            expect(j.numberOf(j.isEven, testArray)).toBe(1);
        });

        it('should return correct count of 0', function(){
            var testArray = [1, 3, 5, 7];

            expect(j.numberOf(j.isEven, testArray)).toBe(0);
        });

        it('should return correct count of 4', function(){
            var testArray = [2, 4, 6, 7, 8];

            expect(j.numberOf(j.isEven, testArray)).toBe(4);
        });

    });

    describe('sort', function(){

        it('should perform a natural sort by default', function(){
            var testArray = [3, 4, 2, 5, 1];

            expect(JSON.stringify(j.sort(testArray))).toBe('[1,2,3,4,5]');
        });

        it('should not modify the original array', function(){
            var testArray = [3, 4, 2, 5, 1];

            j.sort(testArray);

            expect(JSON.stringify(testArray)).not.toBe('[1,2,3,4,5]');
        });

        it('should sort with a sorting function', function(){
            var testArray = [{ value: 3 },
                             { value: 2 },
                             { value: 5 },
                             { value: 1 },
                             { value: 4 }],
                expectedValue = [{ value: 1 },
                                 { value: 2 },
                                 { value: 3 },
                                 { value: 4 },
                                 { value: 5 }];

            function comparator(a, b){
                var comparison = 0;

                comparison = a.value < b.value ? -1 : comparison;
                comparison = b.value < a.value ? 1 : comparison;

                return comparison;
            }

            expect(JSON.stringify(j.sort(comparator, testArray))).toBe(JSON.stringify(expectedValue));
        });

    });

})();
