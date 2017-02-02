module.exports = function (runner, j) {
    var myArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var identity = j.identity;
    var appliedIdentityMap = j.map(identity);
    var time = 0;

    time = runner(function () { var result = myArray.map(identity); });
    console.log('Array.prototype.map', time);

    time = runner(function () { var result = j.map(identity)(myArray); });
    console.log('j.map', time);

    time = runner(function () { var result = appliedIdentityMap(myArray); });
    console.log('appliedIdentityMap', time);

}