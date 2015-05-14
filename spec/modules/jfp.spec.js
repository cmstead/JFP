var jfp = require('../../dist/jfp.js'),
    j = jfp;

describe('jfp function', function(){

    it('should curry passed function', function(){
        function add(a, b, c, d){
            return a + b + c + d;
        }

        expect(j(add, 1)(2, 3)(4)).toBe(10);
    });

});
