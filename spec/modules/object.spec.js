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

        it('should return null if key is not found.', function(){
            expect(j.pick('test', {})).toBe(null);
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

})();