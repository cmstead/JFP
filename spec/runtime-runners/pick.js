var testObj = {
    foo: {
        bar: {
            baz: [
                {
                    quux: 'done'
                }
            ]
        }
    }
};

function runTests(runner, j) {
    function rawPick(key) {
        return function (obj) {
            return j.isDefined(obj) ? j.maybeDefined(obj[key]) : null;
        }
    }

    function tryPick(key) {
        return function (obj) {
            try {
                return j.maybeDefined(obj[key]);
            } catch (e) {
                return null;
            }
        }
    }

    time = runner(function () { rawPick('foo')(testObj); });
    console.log('rawPick', time);

    time = runner(function () { tryPick('foo')(testObj); });
    console.log('tryPick', time);

    time = runner(function () { j.pick('foo')(testObj); });
    console.log('j.pick', time);

}

module.exports = runTests;