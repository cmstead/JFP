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
    
    describe('each', function(){
        
        it('should return an array', function(){
            expect(JSON.stringify(j.each())).toBe('[]');
        });
        
        it('should call passed function with a single value', function(){
            var spy = jasmine.createSpy('callback');
            j.each(spy, [1]);
            expect(spy).toHaveBeenCalledWith(1);
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

})();