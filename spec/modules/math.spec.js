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
	

    });
    
})();
