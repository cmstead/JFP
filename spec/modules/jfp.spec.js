var jfp = require('../../dist/jfp.js'),
    j = jfp;

describe('jfp function', function(){

    it('should curry passed function', function(){
        function add(a, b, c, d){
            return a + b + c + d;
        }

        expect(j(add, 1)(2, 3)(4)).toBe(10);
    });

    it('should return a function if the first parameter is the string name of a jfp function', function(){
        expect(typeof j('add')).toBe('function');
    });
    
    it('should curry the returned function', function(){
        expect(j('add')(2)(3)).toBe(5);
    });

});
