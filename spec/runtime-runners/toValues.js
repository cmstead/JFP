var objA = {
    a: 'a',
    b: 'b',
    c: 'c'
};

function runTests(runner, j) {
    var time = 0;

    time = runner(function () { var result = j.toValues(objA); });
    console.log('j.toValues', time);
}

module.exports = runTests;