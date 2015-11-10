var jfp = require('../../dist/jfp.js'),
    j = jfp;

(function(){
    'use strict';

    describe('pick', function(){

        it('should return null if no values are passed', function(){
            expect(j.pick()).toBe(null);
        });

        it('should return null if no collection is passed', function(){
            expect(j.pick('test')).toBe(null);
        });

        it('should return a picked value if key is found', function(){
            expect(j.pick('test', { 'test': 'test value' })).toBe('test value');
        });

        it('should return null if object.key is undefined.', function(){
            expect(j.pick('test', {})).toBe(null);
        });

        //These are to ensure falsey values are preserved, except undefined
        it('should return false if object.key is false', function(){
            expect(j.pick('test', { test: false })).toBe(false);
        });

        it('should return false if object.key is 0', function(){
            expect(j.pick('test', { test: 0 })).toBe(0);
        });

        it('should return false if object.key is ""', function(){
            expect(j.pick('test', { test: "" })).toBe("");
        });

    });

    describe('pluck', function(){

        it('should return an empty object if no arguments are passed', function(){
            expect(JSON.stringify(j.pluck())).toBe('{}');
        });

        it('should return an empty object if one argument is passed', function(){
            expect(JSON.stringify(j.pluck('test'))).toBe('{}');
        });

        it('should return key/vale pair in an object if key is found', function(){
            var testObj = {
                test1: 'test value 1',
                test2: 'test value 2',
                test3: 'test value 3',
                test4: 'test value 4'
            };

            expect(JSON.stringify(j.pluck('test1', testObj))).toBe('{"test1":"test value 1"}');
        });

    });

    describe('pluckKeys', function(){

        var testObj;

        beforeEach(function(){
            testObj = {
                test1: 'test value 1',
                test2: 'test value 2',
                test3: 'test value 3',
                test4: 'test value 4'
            };
        });

        it('should return an empty object if no arguments are passed', function(){
            expect(JSON.stringify(j.pluckKeys())).toBe('{}');
        });

        it('should return an empty object if just keys are passed', function(){
            expect(JSON.stringify(j.pluckKeys(['test']))).toBe('{}');
        });

        it('should return an object with a single key selected', function(){
            expect(JSON.stringify(j.pluckKeys(['test1'], testObj))).toBe('{"test1":"test value 1"}');
        });

        it('should return an object with all keys selected', function(){
            expect(JSON.stringify(j.pluckKeys(['test1', 'test2'], testObj))).
                toBe('{"test1":"test value 1","test2":"test value 2"}');
        });

    });

    describe('merge', function(){

        it('should return null when no arguments are provided', function(){
            expect(j.merge()).toBe(null);
        });

        it('should return a copy of the default when defined', function(){
            var defaultData = {
                test1: 'test value 1',
                test2: 'test value 2'
            };

            expect(JSON.stringify(j.merge(defaultData))).toBe(JSON.stringify(defaultData));
        });

        it('should not return pointer to default data', function(){
            var defaultData = { test: 'test' };

            expect(j.merge(defaultData)).not.toBe(defaultData);
        });

        it('should merge data into default data.', function(){
            var defaultData = {
                    test1: 'test value 1',
                    test2: 'test value 2',
                    test3: 'test value 3'
                },
                mergeData = {
                    test1: 'merge value 1'
                };

            expect(j.merge(defaultData, mergeData).test1).toBe('merge value 1');
        });

    });

    describe('getKeys', function () {
        
        it('should return an empty array if object is empty', function () {
            expect(JSON.stringify(j.getKeys({}))).toBe('[]');
        });
        
        it('should return array of keys if object is not empty', function () {
            expect(JSON.stringify(j.getKeys({'foo': 'bar', 'baz': 'quux'}))).toBe('["foo","baz"]');
        });
        
        it('should return an empty arrray if value is not an object', function () {
            expect(JSON.stringify(j.getKeys('I am a string'))).toBe('[]');
        });
        
    });

})();
