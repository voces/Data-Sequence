
(function(window) {

    let worker = new Worker("worker.js");
    worker.addEventListener("message", function(e) {
        workerMessage(e.data);
    });

    function workerMessage(message) {

        if (typeof message.row !== "undefined") delim.rowEvent(message);
        if (typeof message.col !== "undefined") delim.colEvent(message);
        // if (typeof message.header !== "undefined") updateHeader(message.header);

        if (typeof message.sample !== "undefined") {
            delim.sampleEvent(message);
            seq.sampleEvent(message);
        }

        if (typeof message.seq !== "undefined") result.seqEvent(message);

            // resultsText.textContent = prepareStringTable(message.sampleSeq, 4, 8, 8);

        if (typeof message.result !== "undefined") result.resultEvent(message);
        
    }

    window.worker = worker;

}(window));
