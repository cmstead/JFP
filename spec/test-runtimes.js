var timer = require('./timer/test-timer')();
var j = require('../dist/jfp');
var myArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

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

function run1000times (fn) {
    var totalTime = 0;

    for(var i = 0; i < 1000; i++) {
        timerStart();
        fn();
        totalTime += timerStopAndReport();
    }

    return totalTime;
}

function testMap () {
    var appliedIdentityMap = j.map(identity);
    var time = 0;

    time = run1000times(function () { var result = myArray.map(identity); });
    console.log('Array.prototype.map', time);

    time = run1000times(function () { var result = j.map(identity)(myArray); });
    console.log('j.map', time);

    time = run1000times(function () { var result = appliedIdentityMap(myArray); });
    console.log('appliedIdentityMap', time);

}

function testFilter () {
    var vowels = ['a', 'e', 'i', 'o', 'u'];
    function isVowel (value) {
        return !(vowels.indexOf(value) < 0);
    }

    time = run1000times(function () { var result = myArray.filter(isVowel); });
    console.log('Array.prototype.filter', time);

    time = run1000times(function () { var result = j.filter(isVowel)(myArray); });
    console.log('j.filter', time);    
}

function always (value) {
    return function () {
        return value;
    }
}

function testAlways () {
    var time = 0;

    time = run1000times(function () { var result = always(true)(); });
    console.log('always', time);

    time = run1000times(function () { var result = j.always(true)(); });
    console.log('j.always', time);
}

testMap();
testFilter();
testAlways();