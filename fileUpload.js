
(function(window) {

    "use strict";

    let control = window.control,
        worker = window.worker,

        fileUpload, fileUploadHeader, fileUploadButton, fileUploadInput,

        fs = require("fs");

    document.addEventListener("DOMContentLoaded", function(e) {

        fileUpload = document.getElementById("file-upload");
        fileUploadHeader = document.getElementById("file-upload-header");
        fileUploadButton = document.getElementById("file-upload-button");
        fileUploadInput = document.getElementById("file-upload-input");

        window.sections.push({container: fileUpload, hideControls: true, focus: () => fileUploadInput.value = ""});

        fileUploadButton.addEventListener("click", () => fileUploadInput.click());

        fileUploadInput.addEventListener("change", function(e) {
            // readFile(this.files[0]);
            control.goNext();
        });

    });

    document.addEventListener("dragover", function(e) {

        let dt = e.dataTransfer;
        if (dt.types !== null && dt.types.indexOf('Files') !== -1) {
            fileUpload.style.borderColor = "#55f";
            fileUploadHeader.style.color = "#55f";

            window.clearTimeout(dragOutTimer);

        }

        e.preventDefault();

    });

    let dragOutTimer;

    document.addEventListener("dragleave", function(e) {

        dragOutTimer = window.setTimeout(function() {
            fileUpload.style.borderColor = "";
            fileUploadHeader.style.color = "";
        }, 25);

    });

    // function readFile(file, callback) {
    //     worker.postMessage({file: file, row: delimRow.value, col: delimCol.value});
    // }

    document.addEventListener("drop", function(e) {

        e.preventDefault();

        // readFile(e.dataTransfer.files[0]);

        control.goNext();

    });

    Object.defineProperty(window, "file", {
        get: () => {
            if (fileUploadInput) return fileUploadInput.files[0]
            else return null;
        }
    });

}(window));
