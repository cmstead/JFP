(function(jasmine, jfp){
    'use strict';

    describe('JFP', function (){

        it('should be an object', function(){
            expect(typeof jfp).toBe('object');
        });

        describe('isObject', function(){

            it('should return true if value is an object', function(){
                expect(jfp.isObject({})).toBe(true);
            });

            it('should return false if value is not an object', function(){
                expect(jfp.isObject('test')).toBe(false);
            });

        });

        describe('isArray', function(){

            it('should return true if value passed is an array', function(){
                expect(jfp.isArray([])).toBe(true);
            });

            it('should return false if value passed is not an array', function(){
                expect(jfp.isArray({})).toBe(false);
            });

        });

        describe('identity', function(){

            it('should return the value it is passed', function(){
                var testObj = {};
                expect(jfp.identity(testObj)).toBe(testObj);
            });

        });

        describe('when', function(){

            it('should execute the passed function when predicate is true', function(){
                var spy = jasmine.createSpy('callback');
                jfp.when(true, spy);
                expect(spy).toHaveBeenCalled();
            });

            it('should not execute the passed function when predicate is false', function(){
                var spy = jasmine.createSpy('callback');
                jfp.when(false, spy);
                expect(spy).not.toHaveBeenCalled();
            });

        });

        describe('iif', function(){

            it('should execute success function when predicate is true', function(){
                var success = jasmine.createSpy('success'),
                    failure = jasmine.createSpy('failure');

                jfp.iif(true, success, failure);

                expect(success).toHaveBeenCalled();
            });

            it('should execute failure function when predicate is false', function(){
                var success = jasmine.createSpy('success'),
                    failure = jasmine.createSpy('failure');

                jfp.iif(false, success, failure);

                expect(failure).toHaveBeenCalled();
            });

        });

        describe('partial', function(){

            it('should return a function', function(){
                var returnedValue = jfp.partial(function(){});

                expect(typeof returnedValue).toBe('function');
            });

            it('should execute the passed function when returned function is called', function(){
                var spy = jasmine.createSpy('userFn'),
                    returnedFn = jfp.partial(spy);

                returnedFn();

                expect(spy).toHaveBeenCalled();
            });

            it('should call spy with set values', function(){
                var spy = jasmine.createSpy('userFn'),
                    returnedFn = jfp.partial(spy, 1, 2);

                returnedFn();

                expect(spy).toHaveBeenCalledWith(1, 2);
            });

            it('should call spy with set and new values', function(){
                var spy = jasmine.createSpy('userFn'),
                    returnedFn = jfp.partial(spy, 1, 2);

                returnedFn(3, 4);

                expect(spy).toHaveBeenCalledWith(1, 2, 3, 4);
            });

        });

        describe('rpartial', function(){

            it('should call spy with set and new values', function(){
                var spy = jasmine.createSpy('userFn'),
                    returnedFn = jfp.rpartial(spy, 1, 2);

                returnedFn(3, 4);

                expect(spy).toHaveBeenCalledWith(1, 2, 3, 4);
            });

        });

        describe('lpartial', function(){

            it('should call spy with set and new values', function(){
                var spy = jasmine.createSpy('userFn'),
                    returnedFn = jfp.lpartial(spy, 1, 2);

                returnedFn(3, 4);

                expect(spy).toHaveBeenCalledWith(3, 4, 1, 2);
            });

        });

        describe('copy', function(){

            it('should return an object when an object is passed', function(){
                var returnedCollection = jfp.copy({});

                expect(jfp.isObject(returnedCollection)).toBe(true);
            });

            it('should return a new object', function(){
                var testObject = { 1: 1, 2: 2, 3: 3, 4: 4 },
                    returnedObject = jfp.copy(testObject);

                expect(returnedObject).not.toBe(testObject);
            });

            it('should return a matching object', function(){
                var testObject = { 1: 1, 2: 2, 3: 3, 4: 4 },
                    returnedObject = jfp.copy(testObject);

                expect(JSON.stringify(testObject)).toBe(JSON.stringify(returnedObject));
            });

            it('should return an array when an array is passed', function(){
                var returnedCollection = jfp.copy([]);

                expect(jfp.isArray(returnedCollection)).toBe(true);
            });

            it('should return a new array', function(){
                var testArray = [1, 2, 3, 4],
                    returnedArray = jfp.copy(testArray);

                expect(returnedArray).not.toBe(testArray);
            });

            it('should return a matching array', function(){
                var testArray = [1, 2, 3, 4],
                    returnedArray = jfp.copy(testArray);

                expect(JSON.stringify(returnedArray)).toBe(JSON.stringify(testArray));
            });

        });

        describe('each', function(){

            it('should execute a function with passed array value', function(){
                var testArray = [1],
                    spy = jasmine.createSpy('userFn');
                jfp.each(testArray, spy);

                expect(spy).toHaveBeenCalledWith(1, 0);
            });

            it('should execute a function once for each element in array', function(){
                var testArray = [1, 2, 3, 4],
                    spy = jasmine.createSpy('userFn');
                jfp.each(testArray, spy);

                expect(spy.callCount).toBe(4);
            });

            it('should execute function passed object value', function(){
                var testObj = { 1: 1 },
                    spy = jasmine.createSpy('userFn');

                jfp.each(testObj, spy);

                expect(spy).toHaveBeenCalledWith(1, '1');
            });

            it('should execute function once for each element in object', function(){
                var testObj = { 1: 1, 2: 2, 3: 3, 4: 4 },
                    spy = jasmine.createSpy('userFn');

                jfp.each(testObj, spy);

                expect(spy.callCount).toBe(4);
            });

        });

        describe('map', function(){

            it('should call passed function for each array element', function(){
                var testArray = [1, 2, 3, 4],
                    spy = jasmine.createSpy('userFn');

                jfp.map(testArray, spy);

                expect(spy.callCount).toBe(4);
            });

            it('should return a mapped array', function(){

                var testArray = [1, 2, 3, 4],
                    returnedArray;

                function mappingFn(value){
                    return 3 * value;
                }

                returnedArray = jfp.map(testArray, mappingFn);

                expect(JSON.stringify(returnedArray)).toBe('[3,6,9,12]');

            });

            it('should call passed function for each array element', function(){
                var testObj = {1: 1, 2: 2, 3: 3, 4: 4},
                    spy = jasmine.createSpy('userFn');

                jfp.map(testObj, spy);

                expect(spy.callCount).toBe(4);
            });

            it('should return a mapped object', function(){
                var testObj = {1: 1, 2: 2, 3: 3, 4: 4},
                    returnedObj;

                function mappingFn(value){
                    return 3 * value;
                }

                returnedObj = jfp.map(testObj, mappingFn);

                expect(JSON.stringify(returnedObj)).toBe('{"1":3,"2":6,"3":9,"4":12}');
            });

        });

        describe('filter', function(){

            it('should call passed function for each array element', function(){
                var testArray = [1, 2, 3, 4],
                    spy = jasmine.createSpy('filerFn');

                jfp.filter(testArray, spy);

                expect(spy.callCount).toBe(4);
            });

            it('should return a filtered array', function(){
                var testArray = [1, 2, 3, 4],
                    returnedArray;

                function filterFn(value){
                    return value % 2 === 0;
                }

                returnedArray = jfp.filter(testArray, filterFn);

                expect(JSON.stringify(returnedArray)).toBe('[2,4]');
            });

            it('should return a filtered object', function(){
                var testObj = { 1:1, 2:2, 3:3, 4:4 },
                    returnedObj;

                function filterFn(value){
                    return value % 2 === 0;
                }

                returnedObj = jfp.filter(testObj, filterFn);

                expect(JSON.stringify(returnedObj)).toBe('{"2":2,"4":4}');
            });

        });

        describe('curry', function(){

            it('should return a function', function(){
                var returnedValue = jfp.curry(function(){});

                expect(typeof returnedValue).toBe('function');
            });

            it('should return a partially applied function', function(){
                var spy = jasmine.createSpy('userFn'),
                    partialFn = jfp.curry(spy);

                partialFn();

                expect(spy).toHaveBeenCalled();
            });

            it('should call spy only when arguments are satisfied', function(){
                var spy = jasmine.createSpy('userFn'),
                    partialFn;

                function testFn(a, b, c, d){
                    spy(a, b, c, d);
                }

                partialFn = jfp.curry(testFn, 1);

                partialFn(2)(3)(4);

                expect(spy).toHaveBeenCalledWith(1, 2, 3, 4);
            });

            it('should should only take first argument on curried function', function(){
                var spy = jasmine.createSpy('userFn'),
                    partialFn;

                function testFn(a, b){
                    var args = Array.prototype.slice.call(arguments, 0);
                    spy.apply(null, args);
                }

                partialFn = jfp.curry(testFn, 1);

                partialFn(2, 3);

                expect(spy).toHaveBeenCalledWith(1, 2);
            });

        });

        describe('thread', function(){

            it('should return the passed value if no function is passed', function(){
                var testCollection = [1, 2, 3, 4],
                    returnedValue = jfp.thread(testCollection);

                expect(returnedValue).toBe(testCollection);
            });

            it('should execute a function', function(){
                var spy = jasmine.createSpy('userFn');

                j.thread('test', spy);

                expect(spy).toHaveBeenCalledWith('test');
            });

            it('should execute functions with previous returned value', function(){
                var returnedValue;

                function firstFn(value){
                    return value + 1
                }

                function secondFn(value){
                    return value * 2;
                }

                function thirdFn(value){
                    return value / 3;
                }

                returnedValue = j.thread(5, firstFn, secondFn, thirdFn);

                expect(returnedValue).toBe(4);

            });

        });

        describe('recur', function(){

            it('should call the calling function', function(){
                var spy = jasmine.createSpy('functionSpy');

                function testRecurer(recurOk){
                    j.when(recurOk, function(){
                        spy();
                        jfp.recur(testRecurer, false);
                    });
                }

                testRecurer(true);

                expect(spy).toHaveBeenCalled;

            });

            it('should call calling function with passed arguments', function(){
                var spy = jasmine.createSpy('functionSpy');

                function testRecurer(recurOk, value){
                    j.iif(recurOk,
                        function(){
                            jfp.recur(testRecurer, false, value);
                        },
                        function(){
                            spy(value);
                        });
                }

                testRecurer(true, 'test');

                expect(spy).toHaveBeenCalledWith('test');

            });

        });

        describe('add', function(){

            it('should return 0 when no arguments are passed', function(){
                var returnedValue = j.add();

                expect(returnedValue).toBe(0);
            });

            it('should return passed value when a sigle value is provided', function(){
                var returnedValue = j.add(5);

                expect(returnedValue).toBe(5);
            });

            it('should return a sum if multiple values are passed', function(){
                var returnedValue = j.add(1, 2, 3, 4);

                expect(returnedValue).toBe(10);
            });

        });

        describe('multiply', function(){

            it('should return 1 if no arguments are passed', function(){
                var returnedValue = j.multiply();

                expect(returnedValue).toBe(1);
            });

            it('should return value if a single value is passed', function(){
                var returnedValue = j.multiply(5);

                expect(returnedValue).toBe(5);
            });

            it('should return a product with multiple arguments', function(){
                var returnedValue = j.multiply(1, 2, 3, 4);

                expect(returnedValue).toBe(24);
            });

        });

    });

})(jasmine, jfp);