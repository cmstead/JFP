(function(){
    'use strict';
    
    describe('Math module', function(){
        
        describe('range', function(){
            
            it('should return an array', function(){
                expect(JSON.stringify(j.range())).toBe('[]');
            });
            
            it('should return an array of a single element if only a single element is provided', function(){
                expect(JSON.stringify(j.range(5))).toBe('[5]');
            });
            
            it('should return an array containing range a to b', function(){
                expect(JSON.stringify(j.range(5, 10))).toBe('[5,6,7,8,9,10]');
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
        
    });
    
})();