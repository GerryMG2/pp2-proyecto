var express = require('express');
const dbs = require('../models/dbs');
const transaction = require('../models/transactions');
const ScriptManager = require('../utils/ScriptManager');
var router = express.Router();

const workerpool = require('workerpool');

function rune(id) {
    console.log("entra la transaction");
    console.log(id);
    workerpool.workerEmit({
        tran: id
    });

    return 1;

}


const pool = workerpool.pool();
pool.exec('rune', [], {
    on: function (payload) {
        console.log("get in");
        ScriptManager.run(payload.tran);
    }
});

router.post("/transaction", function (req, res, next) {
    try {
        console.log(req.body);
        let tran = transaction.create({
            script: req.body.script,
            data: req.body.data,
            connection: req.body.connection,
            terminated: false
        })

        tran.save().then((L) => {

            pool.exec(rune, [1]).then(function (result) {
                console.log(result);
                res.status(200).json({ receive: true });
            })
                .catch(function (err) {
                    console.log(err);
                    res.status(500).json({ receive: false });
                })


        });



    } catch (error) {
        console.log(error);
        res.status(500).json({ receive: false });
    }

});

module.exports = router;