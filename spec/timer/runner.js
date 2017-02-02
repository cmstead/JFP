var timer = require('./test-timer')();

timer.setMaxAcceptableTime(0);

function timerStart() {
    timer.reset();
    timer.start();
}

function timerStopAndReport() {
    timer.stop();
    return timer.getTotal();
}

function run1000times(fn) {
    var totalTime = 0;

    for (var i = 0; i < 1000; i++) {
        timerStart();
        fn();
        totalTime += timerStopAndReport();
    }

    return totalTime;
}

module.exports = run1000times;
