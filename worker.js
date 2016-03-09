
let rowDelim = false, colDelim = false,
    rawData = false, rawRows = false, rows = false, sequencedData = false;
    // header = undefined;

function fileRead() {

    // console.log("fileRead");

    rawData = this.result.replace(/\n\r/g, "\n")
                         .replace(/\r\n/g, "\n")
                         .replace(/\r/g, "\n")
                         .replace(/\r/g, "");

    // console.log({res: this.result, data: rawData});

    if (rowDelim) calcRows();

}

function detectColDelim() {

    // console.log("detectColDelim", rawRows ? true : false);

    //Can only detect the column delim if there are rawRows
    if (!rawRows) return;

    //Setup our variables; charTable will be initially scanned; tempChar each row, possible how many candidates left
    let charTable = {}, tempCharTable, possible = 0;

    //Locate our candidates
    for (let i = 0; i < rawRows[0].length; i++)
        if (typeof charTable[rawRows[0][i]] === "undefined") {
            charTable[rawRows[0][i]] = 1;
            possible++;
        } else charTable[rawRows[0][i]]++;

    //Loop through all the other rawRows; the eventual solution would exist the same amount of times in each row
    let i = 1;
    while (possible > 1 && i < rawRows.length && i < 20) {
        tempCharTable = {};
        for (let n = 0; n < rawRows[i].length; n++) {
            if (typeof charTable[rawRows[i][n]] === "undefined") continue;
            if (typeof tempCharTable[rawRows[i][n]] === "undefined")
                tempCharTable[rawRows[i][n]] = 1;
            else tempCharTable[rawRows[i][n]]++;
        }
        for (let prop in charTable) {
            if (charTable[prop] !== tempCharTable[prop]) {
                delete charTable[prop];
                possible--;
            }
        }
        i++;
    }

    if (possible > 0) {
        // console.log("found");
        colDelim = "";
        for (let prop in charTable) colDelim += prop;
        self.postMessage({row: rowDelim, col: colDelim});
        calcCols();
    }// else console.log("not found");
}

function calcRows() {

    // console.log("calcRows", rowDelim, rawData ? true : false);

    if (!rawData) {
        rawRows = false;
        rows = false;
        return;
    }

    rawRows = rawData.split(rowDelim);
    // console.log(rawRows.slice(0));

    while (rawRows[rawRows.length - 1] === "")
        rawRows.pop();

    rows = false;

    if (colDelim) calcCols();
    else detectColDelim();
}

function calcCols() {

    // console.log("calcCols", rawRows ? true : false, colDelim);

    if (!rawRows) return;

    rows = [];

    let sample = [], sampleEnd = Math.min(10, rawRows.length);

    for (let i = 0; i < sampleEnd; i++) {
        rows[i] = rawRows[i].split(colDelim);
        sample.push(rows[i]);
    }

    // if (rows.length > 1) detectHeader();

    self.postMessage({sample: sample, row: rowDelim, col: colDelim});

    for (let i = sampleEnd; i < rawRows.length; i++)
        rows[i] = rawRows[i].split(colDelim);

    // self.postMessage({rawRows: rawRows, row: rowDelim, col: colDelim});

    // console.log(rawRows.slice(0));

}

// function detectHeader() {
//
//     for (let i = 0; i < rawRows[0].length; i++)
//         if (typeof rawRows[0][i] !== typeof rawRows[1][i] ||
//             isNaN(rawRows[0][i]) !== isNaN(rawRows[1][i])) {
//
//             header = true;
//             break;
//
//         }
//
//     if (!header) header = false;
//     self.postMessage({header: header});
//
// }

function sequenceData(opts) {

    let binIndices = [],
        seqIndices = [],
        carryIndices = [],

        bins = [], carrys = [];

    sequencedData = [];

    for (let i = 0; i < opts.bins.length; i++) binIndices.push(rows[0].indexOf(opts.bins[i]));
    for (let i = 0; i < opts.seq.length; i++) seqIndices.push(rows[0].indexOf(opts.seq[i]));
    for (let i = 0; i < opts.carrys.length; i++) carryIndices.push(rows[0].indexOf(opts.carrys[i]));

    for (let i = 1; i < rows.length; i++) {

        let id = [], values = [];

        for (let n = 0; n < binIndices.length; n++) id.push(rows[i][binIndices[n]]);
        id = id.join("bRe4K;");

        if (typeof bins[id] === "undefined") {
            bins[id] = [];

            carrys[id] = [];
            for (let n = 0; n < carryIndices.length; n++) carrys[id].push(rows[i][carryIndices[n]]);
        }

        for (let n = 0; n < seqIndices.length; n++) values.push(rows[i][seqIndices[n]]);

        bins[id].push(values.join("iNn3rSeQD3liM;"));
        // bins[id].push(rows[i][seqIndex]);

    }

    sequencedData.push(opts.bins.concat([opts.seq.join("iNn3rSeQD3liM;")]).concat(opts.carrys));
    for (let id in bins) sequencedData.push(id.split("bRe4K;").concat([bins[id].join("s3qDeL1M;")]).concat(carrys[id]));

    self.postMessage({seq: true});

}

function unEscapesToReadable(text) {

    if (text instanceof RegExp) text = text.toString().slice(1, -1);

    return text
        .replace(/\\n/g, "\n")
        .replace(/\\'/g, "\'")
        .replace(/\\"/g, '\"')
        .replace(/\\&/g, "\&")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\f/g, "\f");
}

function exportData(opts, sample) {

    let s = "",
        max = sample ? Math.min(sequencedData.length, 8) : sequencedData.length;

    // console.log([opts.col, opts.col.replace(/\\/g, "\\")], opts.col == opts.col.replace(/\\\\/g, "\\"));

    for (let i = 0; i < max; i++)
        s += sequencedData[i].join(unEscapesToReadable(opts.col)) + unEscapesToReadable(opts.row);

    s = s.replace(/s3qDeL1M;/g, unEscapesToReadable(opts.seq));
    s = s.replace(/iNn3rSeQD3liM;/g, unEscapesToReadable(opts.subSeq));

    self.postMessage({result: s, sample: sample});

}

self.addEventListener("message", function(e) {

    // console.log("message", e.data);

    if (e.data.file) {
        let reader = new FileReader();
        reader.addEventListener("load", fileRead);
        reader.readAsText(e.data.file);
    }

    if (e.data.row) rowDelim = new RegExp(e.data.row);
    if (e.data.col) colDelim = new RegExp(e.data.col);

    if (e.data.row) calcRows();
    if (e.data.col && !e.data.row) calcCols();

    if (typeof e.data.seq !== "undefined") sequenceData(e.data.seq);

    if (typeof e.data.export !== "undefined") exportData(e.data.export, e.data.sample ? true : false);

}, false);
