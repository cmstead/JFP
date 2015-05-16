var jfp = require('../../dist/jfp.js'),
    j = jfp;

(function(){
    'use strict';

    describe('toValues', function(){

        it('should return null if object is not passed', function(){
            expect(j.toValues()).toBe(null);
        });

        it('should return an array of values when object is passed', function(){
            expect(JSON.stringify(j.toValues({ test1: 'test value 1', test2: 'test value 2'})))
                .toBe('["test value 1","test value 2"]');
        });

        it('should not capture inherited values', function(){
            var obj1 = { 'parent': 'not stored' },
                tempObj;

            function Test(){}

            Test.prototype = Object.create(obj1);
            tempObj = new Test();
            tempObj.child = 'stored'; //This is unique to the object instance.

            expect(JSON.stringify(j.toValues(tempObj))).toBe('["stored"]');
        });

    });

    describe('toDec', function(){

        it('should return null if passed value is not numeric', function(){
            expect(j.toDec()).toBe(null);
        });

        it('should return original value if it is a number', function(){
            expect(j.toDec(0x123)).toBe(0x123);
        });

        it('should convert string to number if string is numeric', function(){
            expect(j.toDec('123')).toBe(123);
        });

    });

})();
