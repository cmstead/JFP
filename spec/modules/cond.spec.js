var j = require('../../dist/jfp.min');
var timer = require('../timer/test-timer')();
var assert = require('chai').assert;


describe('jfp cond', function () {

    beforeEach(function () {
        timer.reset();
        timer.start();
    });

    afterEach(function () {
        timer.stop();
        timer.report();
    });


    function condTest1(value) {
        return j.cond(function (when, then) {
            when(value === 1, then(j.identity, 'one'));
            when(value === 2, then(j.identity, 'two'));
            when(value === 3, then(j.always('three')));
        });
    }

    function condTest2(value) {
        return j.cond(function (when, then, _default) {
            when(value === 1, then(j.identity, 'one'));
            when(value === 2, then(j.identity, 'two'));
            when(value === 3, then(j.identity, 'three'));
            when(_default, then(j.always('too big!')));
        });
    }

    var fac = j.recur(function fac(recur, n, result) {
        result = j.either('number')(1)(result);

        return j.cond(function (when, then, _default) {
            when(n === 0,
                then(result));
            when(_default,
                then(recur, j.dec(n), (result * n)));
        });
    });

    it('should work as an expression', function () {
        assert.equal(condTest1(2), 'two');
    });

    it('should throw an error if value is out of bounds and no default is set', function () {
        assert.throws(j.partial(condTest1, 5));
    });

    it('should execute default if no other condition is satisfied', function () {
        assert.equal(condTest2(5), 'too big!');
    });

    it('should compute factorial properly', function () {
        assert.equal(fac(5), 120);
    });

});

if(typeof global.runQuokkaMochaBdd === 'function') {
    runQuokkaMochaBdd();
}
