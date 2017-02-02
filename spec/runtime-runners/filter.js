module.exports = function (runner, j) {
    var myArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    // function alwaysTrue() {
    //     return true;
    // }

    var alwaysTrue = j.always(true);

    var vowels = ['a', 'e', 'i', 'o', 'u'];
    function isVowel(value) {
        return !(vowels.indexOf(value) < 0);
    }

    var appliedVowelFilter = j.filter(isVowel);

    time = runner(function () { var result = myArray.filter(isVowel); });
    console.log('Array.prototype.filter', time);

    time = runner(function () { var result = j.filter(isVowel)(myArray); });
    console.log('j.filter', time);

    time = runner(function () { var result = appliedVowelFilter(myArray); });
    console.log('appliedVowelFilter', time);

}