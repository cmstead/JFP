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


})();