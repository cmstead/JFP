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
        
    });
    
})();