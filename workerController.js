
(function(window) {

    const path = require('path');

    let worker = require("child_process").fork("worker.js");

    worker.on("message", e => workerMessage(e));

    // worker.on("error", (e, e2, e3) => console.error(e, e2, e3));
    // worker.on("close", e => console.error(e));

    function workerMessage(message) {

        // console.log(message);

        if (typeof message.col !== "undefined") delim.colEvent(message);
        if (typeof message.row !== "undefined") delim.rowEvent(message);
        //For some reason, execution dies here if rowEvent is called...

        if (typeof message.sample !== "undefined" && typeof message.sample !== "boolean") {
            delim.sampleEvent(message);
            seq.sampleEvent(message);
        }

        if (typeof message.seq !== "undefined") result.seqEvent(message);

            // resultsText.textContent = prepareStringTable(message.sampleSeq, 4, 8, 8);

        if (typeof message.result !== "undefined") result.resultEvent(message);

    }

    window.worker = worker;

}(window));
