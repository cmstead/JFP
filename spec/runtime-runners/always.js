function always(value) {
    return function () {
        return value;
    }
}

function runTests(runner, j) {
    var time = 0;

    time = runner(function () { var result = always(true)(); });
    console.log('always', time);

    time = runner(function () { var result = j.always(true)(); });
    console.log('j.always', time);
}

module.exports = runTests;