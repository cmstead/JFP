var objA = {
    a: 'a',
    b: 'b',
    c: 'c'
};

var objB = {
    1: '1',
    2: '2',
    3: '3'
};

function runTests(runner, j) {
    var time = 0;

    time = runner(function () { var result = j.merge(objA, objB); });
    console.log('j.merge', time);
}

module.exports = runTests;