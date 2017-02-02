function runTests(runner, j) {
    time = runner(function () { j.either('defined')({})({}); });
    console.log('j.either success', time);

    time = runner(function () { j.either('defined')({})(undefined); });
    console.log('j.either fail', time);
}

module.exports = runTests;