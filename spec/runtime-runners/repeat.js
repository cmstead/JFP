
function runTests(runner, j) {
    var time = 0;
    var inc = require('../runtime-helpers/helper-functions').inc;

    time = runner(function () { var result = j.repeat(inc)(100)(10); });
    console.log('j.repeat', time);

}

module.exports = runTests;