try {
    var j = require('../dist/jfp');
} catch (e) { 
    /* noop */
}

var runner = require('./timer/runner');
var fs = require('fs');

function runTests() {
    console.log();
    console.log('***** These numbers are a result of 1000 runs *****');
    console.log();

    var files = fs.readdirSync('./spec/runtime-runners');
    var testRunners = [];

    console.log('***** Loading Files *****');

    files.forEach(function (fileName) {
        testRunners.push(require('./runtime-runners/' + fileName));
    });

    console.log('***** Running Tests *****');

    testRunners.forEach(function (testRunner) {
        testRunner(runner, j);
        console.log();
    });
}

module.exports = runTests;