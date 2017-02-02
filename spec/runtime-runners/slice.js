function runTests(runner, j) {
    var time = 0;
    var myArray = [1, 2, 3, 4, 5, 6, 7];
    var appliedSlice = j.slice(0);

    time = runner(function () { var result = myArray.slice(0); });
    console.log('array.slice', time);

    time = runner(function () { var result = Array.prototype.slice.call(myArray, 0); });
    console.log('Array.prototype.slice', time);

    time = runner(function () { var result = j.slice(0)(myArray); });
    console.log('j.slice', time);

    time = runner(function () { var result = appliedSlice(myArray); });
    console.log('appliedSlice', time);

}

module.exports = runTests;