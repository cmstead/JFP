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

    function getRef() {
        if (testObj && testObj.foo && testObj.foo.bar && testObj.foo.bar.baz && testObj.foo.bar.baz[1] && testObj.foo.bar.baz[1].quux) {
            return testObj.foo.bar.baz[1].quux;
        }

        return null;
    }

    function tryGetRef() {
        try {
            return testObj.foo.bar.baz[1].quux;
        } catch (e) {
            return null;
        }
    }

    function tryDeref(key) {
        var tokens = key.split('.');

        return function (obj) {
            var result;
            var tokenLen = tokens.length;

            for (var i = 0; i < tokenLen; i++) {
                try {
                    result = obj[tokens[i]];
                } catch (e) {
                    return null;
                }
            }

            return result;
        };
    }

    var jderef = j.deref('foo.bar.baz.1.quux');
    var jtryDeref = tryDeref('foo.bar.baz.1.quux');

    time = runner(getRef);
    console.log('getRef', time);

    time = runner(tryGetRef);
    console.log('tryGetRef', time);

    time = runner(function () { jtryDeref(testObj); });
    console.log('tryDeref', time);

    time = runner(function () { jderef(testObj); });
    console.log('j.deref', time);

}

module.exports = runTests;