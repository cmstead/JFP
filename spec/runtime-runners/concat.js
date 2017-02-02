function runTests(runner, j) {
    var time = 0;
    var myArray = require('../runtime-helpers/sample-data').alphabet;

    time = runner(function () { var result = myArray.concat(myArray); });
    console.log('Array.prototype.concat', time);

    time = runner(function () { var result = j.concat(myArray, myArray); });
    console.log('j.concat', time);

}

module.exports = runTests;