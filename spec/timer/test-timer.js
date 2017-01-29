'use strict';

function timerFactory () {
    var maxMilliseconds = 0.75;
    var total = 0;
    var startTime = 0;


    function start() {
        startTime = process.hrtime();
    }

    function stop() {
        total += parseInt(process.hrtime(startTime)[1], 10) / 1000000;
        startTime = 0;
    }

    function getTotal() {
        return total;
    }

    function reset() {
        total = 0;
    }

    function report() {
        if(total > maxMilliseconds) {
            console.log('Long run detected: ' + total + 'ms');
        }
    }

    function setMaxAcceptableTime (maxMs) {
        maxMilliseconds = maxMs;
    }

    return {
        getTotal: getTotal,
        reset: reset,
        report: report,
        setMaxAcceptableTime: setMaxAcceptableTime,
        start: start,
        stop: stop
    };
}

module.exports = timerFactory;