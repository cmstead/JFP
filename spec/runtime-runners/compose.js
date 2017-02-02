function runTests(runner, j) {
    var time = 0;

    function inc (a) {
        return a + 1;
    }

    time = runner(function () { var result = j.compose(inc, inc); });
    console.log('j.compose', time);

}

module.exports = runTests;