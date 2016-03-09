
(function(window) {
    "use strict";

    let control = window.control,
        worker = window.worker,
        util = window.util,

        seq, seqBin, seqSeq, seqCarry, seqSeqValues;

    document.addEventListener("DOMContentLoaded", function(e) {

        seq = document.getElementById("seq");
        seqBin = document.getElementById("seq-bin");
        seqSeq = document.getElementById("seq-seq");
        seqCarry = document.getElementById("seq-carry");
        seqSeqValues = [];

        seqSeq.addEventListener("change", seqChange);

        window.sections.push({container: seq, blur: () =>
            worker.postMessage({seq: {
                bins: util.getSelectOptions(seqBin),
                seq: seqSeqValues,
                carrys: util.getSelectOptions(seqCarry)
            }})
        });

    });

    function seqChange() {

        let newValues = util.getSelectOptions(seqSeq);

        if (newValues.length === 1) seqSeqValues = newValues;
        else {
            for (let i = 0; i < seqSeqValues.length; i++)
                if (newValues.indexOf(seqSeqValues[i]) < 0) {
                    seqSeqValues.splice(i, 0);
                    i--;
                }

            for (let i = 0; i < newValues.length; i++)
                if (seqSeqValues.indexOf(newValues[i]) < 0)
                    seqSeqValues.push(newValues[i]);
        }

        for (let i = 0; i < seqSeq.options.length; i++) {
            let index = seqSeqValues.indexOf(seqSeq.options[i].textContent);
            if (index < 0) seqSeq.options[i].setAttribute("data-order", "");
            else seqSeq.options[i].setAttribute("data-order", index + 1);

        }

    }

    function loadSeqSelects(header) {

        let binOptions = util.getSelectOptions(seqBin),
            seqOptions = seqSeqValues,
            carryOptions = util.getSelectOptions(seqCarry);

        if (binOptions.length || seqOptions.length || carryOptions.length) return;

        seqBin.innerHTML = "";
        seqSeq.innerHTML = "";
        seqCarry.innerHTML = "";

        for (let i = 0; i < header.length; i++) {
            let el = document.createElement("option");
            el.value = header[i];
            el.textContent = header[i];
            seqBin.appendChild(el);

            seqSeq.appendChild(el.cloneNode(true));
            seqCarry.appendChild(el.cloneNode(true));
        }

    }

    window.seq = {
        sampleEvent: (message) => loadSeqSelects(message.sample[0])
    };


}(window))
