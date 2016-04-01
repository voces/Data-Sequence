
(function(window) {
    "use strict";

    let controls = window.controls,
        worker = window.worker,
        file = window.file,

        delim, delimRow, delimCol, delimHeaderYes, delimHeaderNo, delimText;

    document.addEventListener("DOMContentLoaded", function(e) {

        delim = document.getElementById("delim");
        delimRow = document.getElementById("delim-row");
        delimCol = document.getElementById("delim-col");
        // delimHeaderYes = document.getElementById("delim-header-yes");
        // delimHeaderNo = document.getElementById("delim-header-no");
        delimText = document.getElementById("delim-text");

        delimRow.addEventListener("keyup", () => worker.send({row: delimRow.value}));
        delimCol.addEventListener("keyup", () => worker.send({col: delimCol.value}));

        // delimHeaderYes.addEventListener("change", enableHeader);
        // delimHeaderNo.addEventListener("change", disableHeader);

        window.sections.push({
            container: delim,
            focus: () => worker.send({
                file: file(),
                row: delimRow.value,
                col: delimCol.value
            })
        });

    });


    function escapesToReadable(text) {

        if (text instanceof RegExp) text = text.toString().slice(1, -1);

        return text
            .replace(/\n/g, "\\n")
            .replace(/\'/g, "\\'")
            .replace(/\"/g, '\\"')
            .replace(/\&/g, "\\&")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t")
            .replace(/\f/g, "\\f");
    }

    function ellipseEscape(text, width) {
        if (text.length > width) return text.substr(0, 8);
        else return text + " ".repeat(width - text.length);
    }

    function prepareStringTable(data, rows, cols, maxWidth) {
        let colWidths = new Array(cols).fill(0);

        for (let i = 0; i < rows; i++)
            for (let n = 0; n < cols; n++)
                try {
                    if (data[i][n].length > colWidths[n]) colWidths[n] = data[i][n].length;
                } catch (err) {
                    colWidths[n] = 0;
                }

        for (let i = 0; i < cols; i++)
            if (colWidths[i] > maxWidth) colWidths[i] = maxWidth;

        let s = "";
        for (let i = 0; i < rows; i++) {
            for (let n = 0; n < cols; n++)
                try {
                    s += ellipseEscape(data[i][n], colWidths[n]) + (n < cols - 1 ? " " : "");
                } catch (err) {
                    s += " ".repeat(colWidths[n]);
                }
            if (i < rows - 1) s += "\n";
        }

        return s;
    }

    window.delim = {
        rowEvent: (message) => delimRow.value = escapesToReadable(message.row),
        colEvent: (message) => delimCol.value = escapesToReadable(message.col),
        sampleEvent: (message) => delimText.textContent = prepareStringTable(message.sample, 6, 8, 8)
    };

}(window))
