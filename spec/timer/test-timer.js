'use strict';

function timerFactory () {
    var total = 0;
    var startTime = 0;


    function start() {
        startTime = Date.now();
    }

    function stop() {
        total += Date.now() - startTime;
        startTime = 0;
    }

    function getTotal() {
        return total;
    }

    function reset() {
        total = 0;
    }

    return {
        getTotal: getTotal,
        reset: reset,
        start: start,
        stop: stop
    };
}

module.exports = timerFactory;