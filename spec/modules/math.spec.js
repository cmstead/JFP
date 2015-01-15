(function(){
    'use strict';
    
    describe('Math module', function(){
        
        describe('range', function(){
            
            it('should return an array', function(){
                expect(JSON.stringify(j.range())).toBe('[]');
            });
            
            it('should return an array of a single element if only a single element is provided', function(){
                expect(JSON.stringify(j.range(5))).toBe('[0,1,2,3,4]');
            });
            
            it('should return an array containing range a to b', function(){
                expect(JSON.stringify(j.range(5, 10))).toBe('[5,6,7,8,9]');
            });
            
            it('should take an incremental value', function(){
                expect(JSON.stringify(j.range(1, 10, 3))).toBe('[1,4,7]');
            });

            it('should properly handle a decremental value', function(){
                expect(JSON.stringify(j.range(10, -3, -3))).toBe('[10,7,4,1,-2]');
            });
        });
        
        describe('add', function(){
            
            it('should return 0 if no values are passed', function(){
                expect(j.add()).toBe(0);
            });
            
            it('should return passed single value', function(){
                expect(j.add(1)).toBe(1);
            });
            
            it('should return sum of two values', function(){
                expect(j.add(1, 2)).toBe(3);
            });
            
            it('should the sum of multiple values', function(){
                expect(j.add(1, 2, 3, 4, 5)).toBe(15);
            });
            
        });
        
        describe('subtract', function(){
            
            it('should return 0 if no values are passed', function(){
                expect(j.subtract()).toBe(0);
            });
            
            it('should return passed single value', function(){
                expect(j.subtract(1)).toBe(1);
            });
            
            it('should return sum of two values', function(){
                expect(j.subtract(1, 2)).toBe(-1);
            });
            
            it('should the sum of multiple values', function(){
                expect(j.subtract(1, 2, 3, 4, 5)).toBe(-13);
            });
            
        });
        
        describe('multiply', function(){
            
            it('should return 0 if no values are passed', function(){
                expect(j.multiply()).toBe(1);
            });
            
            it('should return passed single value', function(){
                expect(j.multiply(2)).toBe(2);
            });
            
            it('should return product of two values', function(){
                expect(j.multiply(2, 3)).toBe(6);
            });
            
            it('should the product of multiple values', function(){
                expect(j.multiply(2, 3, 4, 5)).toBe(120);
            });
            
        });

        describe('divide', function(){
            
            it('should return 0 if no values are passed', function(){
                expect(j.divide()).toBe(1);
            });
            
            it('should return passed single value', function(){
                expect(j.divide(2)).toBe(2);
            });
            
            it('should return 1/product of two values', function(){
                expect(j.divide(6, 3)).toBe(2);
            });
            
            it('should the 1/product of multiple values', function(){
                expect(j.divide(12, 3, 2, 2)).toBe(1);
            });
            
        });

        describe('mod', function(){

            it('should return 0 when no arguments are passed', function(){
                expect(j.mod()).toBe(0);
            });

            it('should return passed value when one argument is passed', function(){
                expect(j.mod(5)).toBe(5);
            });

            it('should return a%b when two arguments are passed', function(){
                expect(j.mod(5, 2)).toBe(1);
            });

        });
	
        describe('truncate', function(){

            it('should return same value if value is an integer', function(){
                expect(j.truncate(5)).toBe(5);
            });

            it('should return integer value when float is passed', function(){
                expect(j.truncate(1.234)).toBe(1);
            });

            it('should return negative number up-wards when float is passed', function(){
                expect(j.truncate(-1.234)).toBe(-1);
            });

        });
        
        describe('max', function(){
            
            it('should return Number.MIN_VALUE if no values are passed', function(){
                expect(j.max()).toBe(-Number.MAX_VALUE);
            });
            
            it('should return passed value if only one value is passed', function(){
                expect(j.max(4)).toBe(4);
            });
            
            it('should return the max of a and b when two values are passed', function(){
                expect(j.max(3, 5)).toBe(5);
            });
            
        });
        
        describe('min', function(){
            
            it('should return Number.Max_VALUE if no values are passed', function(){
                expect(j.min()).toBe(Number.MAX_VALUE);
            });
            
            it('should return passed valie if only one value is passed', function(){
                expect(j.min(4)).toBe(4);
            });
            
            it('should return min of a and b when two values are passed', function(){
                expect(j.min(4, 3)).toBe(3);
            });
            
        });

    });
    
})();
