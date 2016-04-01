
(function(window) {

    "use strict";

    let control = window.control,
        worker = window.worker,

        fileUpload, fileUploadHeader, fileUploadButton, fileUploadInput,
        filePath,

        fs = require("fs");

    document.addEventListener("DOMContentLoaded", function(e) {

        fileUpload = document.getElementById("file-upload");
        fileUploadHeader = document.getElementById("file-upload-header");
        fileUploadButton = document.getElementById("file-upload-button");
        fileUploadInput = document.getElementById("file-upload-input");

        window.sections.push({
            name: "fileUpload",
            container: fileUpload,
            hideControls: true,
            focus: () => fileUploadInput.value = ""
        });

        fileUploadButton.addEventListener("click", () => fileUploadInput.click());

        fileUploadInput.addEventListener("change", function(e) {
            filePath = fileUploadInput.files[0].path;
            control.goNext();
        });

    });

    document.addEventListener("dragover", function(e) {
        if (control.section.name !== "fileUpload") return;

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
        if (control.section.name !== "fileUpload") return;

        dragOutTimer = window.setTimeout(function() {
            fileUpload.style.borderColor = "";
            fileUploadHeader.style.color = "";
        }, 25);

    });

    document.addEventListener("drop", function(e) {
        e.preventDefault();
        if (control.section.name !== "fileUpload") return;

        fileUpload.style.borderColor = "";
        fileUploadHeader.style.color = "";

        filePath = e.dataTransfer.files[0].path;
        control.goNext();
    });

    window.file = () => filePath;

}(window));
