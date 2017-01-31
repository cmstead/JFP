var timer = require('./timer/test-timer')();
var j = require('../dist/jfp');
var myArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var testObj = {
    foo: {
        bar: {
            baz: [
                {
                    quux: 'done'
                }
            ]
        }
    }
};

function identity(x) {
    return x;
}

function alwaysTrue() {
    return true;
}

timer.setMaxAcceptableTime(0);

function timerStart() {
    timer.reset();
    timer.start();
}

function timerStopAndReport() {
    timer.stop();
    return timer.getTotal();
}

function run1000times(fn) {
    var totalTime = 0;

    for (var i = 0; i < 1000; i++) {
        timerStart();
        fn();
        totalTime += timerStopAndReport();
    }

    return totalTime;
}

function testMap() {
    var appliedIdentityMap = j.map(identity);
    var time = 0;

    time = run1000times(function () { var result = myArray.map(identity); });
    console.log('Array.prototype.map', time);

    time = run1000times(function () { var result = j.map(identity)(myArray); });
    console.log('j.map', time);

    time = run1000times(function () { var result = appliedIdentityMap(myArray); });
    console.log('appliedIdentityMap', time);

}

function testFilter() {
    var vowels = ['a', 'e', 'i', 'o', 'u'];
    function isVowel(value) {
        return !(vowels.indexOf(value) < 0);
    }

    time = run1000times(function () { var result = myArray.filter(isVowel); });
    console.log('Array.prototype.filter', time);

    time = run1000times(function () { var result = j.filter(isVowel)(myArray); });
    console.log('j.filter', time);
}

function testDeref() {

    function getRef() {
        if (testObj && testObj.foo && testObj.foo.bar && testObj.foo.bar.baz && testObj.foo.bar.baz[1] && testObj.foo.bar.baz[1].quux) {
            return testObj.foo.bar.baz[1].quux;
        }

        return null;
    }

    function tryGetRef() {
        try {
            return testObj.foo.bar.baz[1].quux;
        } catch (e) {
            return null;
        }
    }

    function tryDeref(key) {
        var tokens = key.split('.');

        return function (obj) {
            var result;
            var tokenLen = tokens.length;

            for (var i = 0; i < tokenLen; i++) {
                try {
                    result = obj[tokens[i]];
                } catch (e) {
                    return null;
                }
            }

            return result;
        };
    }

    var jderef = j.deref('foo.bar.baz.1.quux');
    var jtryDeref = tryDeref('foo.bar.baz.1.quux');

    time = run1000times(getRef);
    console.log('getRef', time);

    time = run1000times(tryGetRef);
    console.log('tryGetRef', time);

    time = run1000times(function () { jtryDeref(testObj); });
    console.log('tryDeref', time);

    time = run1000times(function () { jderef(testObj); });
    console.log('j.deref', time);

}

function testPick(value) {
    function rawPick(key) {
        return function (obj) {
            return j.isDefined(obj) ? j.maybeDefined(obj[key]) : null;
        }
    }

    function tryPick(key) {
        return function (obj) {
            try {
                return j.maybeDefined(obj[key]);
            } catch (e) {
                return null;
            }
        }
    }

    time = run1000times(function () { rawPick('foo')(testObj); });
    console.log('rawPick', time);

    time = run1000times(function () { tryPick('foo')(testObj); });
    console.log('tryPick', time);

    time = run1000times(function () { j.pick('foo')(testObj); });
    console.log('j.pick', time);

}

function testEither() {
    time = run1000times(function () { j.either('defined')({})({}); });
    console.log('j.either success', time);

    time = run1000times(function () { j.either('defined')({})(undefined); });
    console.log('j.either fail', time);
}

function testMaybe() {
    time = run1000times(function () { j.maybe('defined')({}); });
    console.log('j.maybe success', time);

    time = run1000times(function () { j.maybe('defined')(undefined); });
    console.log('j.maybe fail', time);
}

function testRecur() {
    function fac(recur, n, current) {
        var result = typeof current !== 'undefined' ? current : 1;
        return n === 0 ? result : recur(n - 1, result * n);
    }

    time = run1000times(function () { j.recur(fac)(0); });
    console.log('recur fac 0', time)

    time = run1000times(function () { j.recur(fac)(2); });
    console.log('recur fac 2', time)

    time = run1000times(function () { j.recur(fac)(30); });
    console.log('recur fac 30', time)
}

function testCurry() {
    function add3Vals (a, b, c) {
        return a + b + c;
    }

    time = run1000times(function () { result = j.curry(add3Vals)(1)(2)(4); });
    console.log('curry', time);

    time = run1000times(function () { result = j.curry(add3Vals, 4)(1)(2)(4)(5); });
    console.log('curry 4', time);
}

function always(value) {
    return function () {
        return value;
    }
}

function testAlways() {
    var time = 0;

    time = run1000times(function () { var result = always(true)(); });
    console.log('always', time);

    time = run1000times(function () { var result = j.always(true)(); });
    console.log('j.always', time);
}

testMap();
console.log();
testFilter();
console.log();
testDeref();
console.log();
testPick();
console.log();
testEither();
console.log();
testMaybe();
console.log();
testRecur();
console.log();
testCurry();
console.log();
testAlways();
