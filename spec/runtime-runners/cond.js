function runTests(runner, j) {
    var time = 0;

    function ifTest(value) {
        if(value === 1) {
            return j.always('one')();
        } else if(value === 2){
            return j.always('two')();
        } else if (value === 3) {
            return j.always('three')();
        } else {
            return j.always('too big!')();
        }
    }

    function condTest(value) {
        return j.cond(function (when, then, _default) {
            when(value === 1, then(j.identity, 'one'));
            when(value === 2, then(j.identity, 'two'));
            when(value === 3, then(j.identity, 'three'));
            when(_default, then(j.always('too big!')));
        });
    }

    time = runner(function () { var result = ifTest(2); });
    console.log('if', time);

    time = runner(function () { var result = condTest(2); });
    console.log('j.cond', time);
}

module.exports = runTests;