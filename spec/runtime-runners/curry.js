function runTests(runner, j) {
    function add3Vals(a, b, c) {
        return a + b + c;
    }

    time = runner(function () { result = j.curry(add3Vals)(1)(2)(4); });
    console.log('curry', time);

    time = runner(function () { result = j.curry(add3Vals, 4)(1)(2)(4)(5); });
    console.log('curry 4', time);
}

module.exports = runTests;