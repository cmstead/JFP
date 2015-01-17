(function(){
    'use strict'
    
    describe('compose', function(){

        it('should return identity function if no function is passed', function(){
            expect(j.compose()).toBe(j.identity);
        });

        it('should call function passed into compose', function(){
            var spy = jasmine.createSpy('userFn');
            j.compose(spy)();
            expect(spy).toHaveBeenCalled();
        });

        it('should call two functions in serial', function(){
            var spy = jasmine.createSpy('userFn');

            function userFn(){
                return 'test';
            }

            j.compose(spy, userFn)();

            expect(spy).toHaveBeenCalledWith('test');
        });

        it('should return the result of the composed functions', function(){
            function add3(value){
                return value + 3;
            }

            expect(j.compose(add3, add3, add3)(5)).toBe(14);
        });

    });
    
    describe('pipline', function(){
        
        it('should return a function', function(){
            expect(typeof j.pipeline()).toBe('function');
        });
        
        it('should execute composed functions in left-right order', function(){
            var add5 = j.partial(j.add, 5),
                multiply2 = j.partial(j.multiply, 2),
                add2 = j.partial(j.add, 2);
                
            expect(j.pipeline(add5, multiply2, add2)(0)).toBe(12)
        });
        
    });

    describe('compact', function(){
        
        it('should remove falsey values from an array', function(){
            var testArray = [1, 2, 0, false, undefined, null, true];

            expect(JSON.stringify(j.compact(testArray))).toBe('[1,2,true]');
        });

    });

})();
