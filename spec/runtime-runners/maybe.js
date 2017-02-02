function runTests(runner, j) {
    time = runner(function () { j.maybe('defined')({}); });
    console.log('j.maybe success', time);

    time = runner(function () { j.maybe('defined')(undefined); });
    console.log('j.maybe fail', time);

    time = runner(function () { j.either('defined')(null)({}); });
    console.log('j.either defined success', time);

    time = runner(function () { j.either('defined')(null)(undefined); });
    console.log('j.either defined', time);
}

module.exports = runTests;