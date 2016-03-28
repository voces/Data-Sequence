
(function(window) {

    let control = window.control,
        worker = window.worker,
        util = window.util,

        results, resultsRow, resultsCol, resultsSeq, resultsSubSeq, resultsSaveButton, resultsSaveInput, resultsText,

        fs = require("fs");

    document.addEventListener("DOMContentLoaded", function(e) {

        results = document.getElementById("results");
        resultsRow = document.getElementById("results-row");
        resultsCol = document.getElementById("results-col");
        resultsSeq = document.getElementById("results-seq");
        resultsSubSeq = document.getElementById("results-sub-seq");
        resultsSaveButton = document.getElementById("results-save-button");
        resultsSaveInput = document.getElementById("results-save-input");
        resultsText = document.getElementById("results-text");

        resultsSaveButton.addEventListener("click", () => resultsSaveInput.click());

        resultsRow.addEventListener("keyup", requestExportSample);
        resultsCol.addEventListener("keyup", requestExportSample);
        resultsSeq.addEventListener("keyup", requestExportSample);
        resultsSubSeq.addEventListener("keyup", requestExportSample);

        resultsSaveInput.addEventListener("change", saveInput);

        window.sections.push({container: results, hideControls: true});

        /*setInterval(function() {
            console.log(new Date().getTime());
        }, 100);*/

    });

    function saveInput() {

        worker.send({export: {
            row: resultsRow.value,
            col: resultsCol.value,
            seq: resultsSeq.value,
            subSeq: resultsSubSeq.value,
            path: resultsSaveInput.files[0].path
        }});

        resultsSaveInput.value = ""

    }

    function requestExportSample() {
        worker.send({
            export: {
                row: resultsRow.value,
                col: resultsCol.value,
                seq: resultsSeq.value,
                subSeq: resultsSubSeq.value
            },
            sample: true
        });
    }

    function resultEvent(message) {

        if (message.sample) {

            // console.log({a: message.result});
            resultsText.textContent = message.result;

        } else {

            fs.writeFile(resultsSaveInput.files[0].path, message.result, function(err) {
                if (err) console.log(err);

                resultsSaveInput.value = "";
            });

        }

    }

    window.result = {
        seqEvent: message => requestExportSample(),
        resultEvent: resultEvent
    };

}(window));
