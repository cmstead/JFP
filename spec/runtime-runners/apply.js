
function add(a, b) {
    return a + b;
}

function runTests(runner, j) {
    var time = 0;

    time = runner(function () { var result = add.apply(null, [1, 2]); });
    console.log('fn.apply', time);

    time = runner(function () { var result = Function.prototype.apply(add, [1, 2]); });
    console.log('Function.prototype.apply', time);

    time = runner(function () { var result = j.apply(add, [1, 2]); });
    console.log('j.apply', time);

}

module.exports = runTests;