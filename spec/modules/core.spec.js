(function(){
    'use strict';

    describe('either', function(){

        it('should return option value if not falsey', function(){
            expect(j.either('default', 'option')).toBe('option');
        });

        it('should return default value if option is falsey', function(){
            expect(j.either('default', false)).toBe('default');
        });

    });

})();