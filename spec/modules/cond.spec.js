var j = require('../../dist/jfp.min');

describe('jfp cond', function () {

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

    var fac = j.recur(function fac (recur, n, result) {
        result = j.either('number')(1)(result);

        return j.cond(function (when, then, _default) {
            when(n === 0, then(result));
            when(_default, then(recur, j.dec(n), (result * n)));
        });
    });

    it('should work as an expression', function () {
       expect(condTest1(1)).toBe('one');
        expect(condTest1(2)).toBe('two');
        expect(condTest1(3)).toBe('three');
    });

    it('should throw an error if value is out of bounds and no default is set', function () {
        expect(condTest1.bind(null, 5)).toThrow();
    });

    it('should execute default if no other condition is satisfied', function () {
        expect(condTest2(5)).toBe('too big!');
    });

    it('should compute factorial properly', function () {
        expect(fac(5)).toBe(120);
    });

});