var objA = {
    a: 'a',
    b: 'b',
    c: 'c'
};

function runTests(runner, j) {
    var time = 0;

    time = runner(function () { var result = j.toArray(objA); });
    console.log('j.toArray', time);
}

module.exports = runTests;