const workerpool = require('workerpool');
const ScriptManager = require("./ScriptManager");

const transaction = require("../models/transactions");

function rune(obj) {
    console.log(typeof obj);
    console.log("entra la transaction");

    ScriptManager.run(obj);

    console.log("scrip pro");
    return 1;

}

workerpool.worker({
    rune: rune
});


const pool = workerpool.pool();




