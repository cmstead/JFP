function runTests(runner, j) {
    function fac(recur, n, current) {
        var result = typeof current !== 'undefined' ? current : 1;
        return n === 0 ? result : recur(n - 1, result * n);
    }

    time = runner(function () { j.recur(fac)(0); });
    console.log('recur fac 0', time)

    time = runner(function () { j.recur(fac)(2); });
    console.log('recur fac 2', time)

    time = runner(function () { j.recur(fac)(30); });
    console.log('recur fac 30', time)
}

module.exports = runTests;