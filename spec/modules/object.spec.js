var j = require('../../dist/jfp.min');
var timer = require('../timer/test-timer')();
var assert = require('chai').assert

describe('jfp object', function () {

    beforeEach(function () {
        timer.reset();
        timer.start();
    });

    afterEach(function () {
        timer.stop();
        timer.report();
    });

    describe('pick', function () {

        it('should pick a value from an object by key', function () {
            var testObj = { foo: 'bar' };
            assert.equal(j.pick('foo')(testObj), 'bar');
        });

        it('should return null if value does not exist', function () {
            var testObj = { foo: 'bar' };
            assert.equal(j.isTypeOf('null')(j.pick('bar')(testObj)), true);
        });

        it('should return null if object is null', function () {
            assert.equal(j.isTypeOf('null')(j.pick('bar')(null)), true);
        });

    });

    describe('deref', function () {
        var testObj;

        beforeEach(function () {
            testObj = {
                foo: {
                    bar: {
                        baz: [1, 2, 3, 4]
                    }
                }
            };
        });

        it('should return a value for a single layer dereference', function () {
            assert.equal(j.deref('foo')(testObj), testObj.foo);
        });

        it('should return a null for a bad reference', function () {
            assert.equal(j.deref('blar')(testObj), null);
        });

        it('should return a value for a multiple layer dereference', function () {
            assert.equal(j.deref('foo.bar.baz.1')(testObj), 2);
        });

    });

    describe('merge', function () {

        it('should merge two objects left to right', function () {

            var objA = {
                test1: 'test1a',
                test2: 'test2a'
            };

            var objB = {
                test2: 'test2b',
                test3: 'test2c'
            };

            var expected = {
                test1: 'test1a',
                test2: 'test2b',
                test3: 'test2c'
            };

            var result = j.merge(objA, objB);

            assert.notEqual(result, objA);
            assert.notEqual(result, objB);
            assert.equal(JSON.stringify(result), JSON.stringify(expected));

        });

    });

    describe('toArray', function () {

        it('should convert an empty object to an empty array', function () {
            var result = j.toArray({});
            assert.equal(JSON.stringify(result), '[]')
        });

        it('should convert an object to an array of tuples', function () {
            var result = j.toArray({ foo: 'bar', baz: 'quux' });
            assert.equal(JSON.stringify(result), '[["foo","bar"],["baz","quux"]]')
        });

    });

    describe('toObject', function () {

        it('should convert an empty array to an empty object', function () {
            var result = j.toObject([]);
            assert.equal(JSON.stringify(result), '{}')
        });

        it('should convert an array of tuples to object', function () {
            var result = j.toObject([['foo', 'bar'], ['baz', 'quux']]);
            assert.equal(JSON.stringify(result), '{"foo":"bar","baz":"quux"}');
        });

    });

    describe('toValues', function () {

        it('should convert an object to an array of values', function () {
            var result = j.toValues({ foo: 'bar', baz: 'quux' });
            assert.equal(JSON.stringify(result), '["bar","quux"]');
        });

    });

    describe('clone', function () {

        it('should copy an object', function () {
            var obj = {
                foo: 'bar',
                baz: {
                    quux: [1, 2, 3, 4]
                }
            };
            var result = j.clone(obj);

            assert.notEqual(obj, result);
            assert.notEqual(obj.baz, result.baz);
            assert.notEqual(obj.baz.quux, result.baz.quux);

            assert.equal(JSON.stringify(obj), JSON.stringify(result));
        });

        it('should throw an error if object is circular or too deep', function () {
            var obj = {
                foo: {}
            };

            obj.foo.bar = obj;

            assert.throws(j.partial(j.clone, obj), 'Object is circular or too deep to clone.');
        });

    });

});

if(typeof global.runQuokkaMochaBdd === 'function') {
    runQuokkaMochaBdd();
}
