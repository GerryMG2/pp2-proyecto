var express = require('express');
const dbs = require('../models/dbs');
const transaction = require('../models/transactions');
const ScriptManager = require('../utils/ScriptManager');
var router = express.Router();
const workerpool = require("workerpool");
const pool = workerpool.pool("./utils/worker.js");


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
            console.log(L);
            pool.exec('rune', [{script: L.script,data: L.data, connection: L.connection, _id: L._id}]).then(function (result) {
                console.log("resultado dentro del worker");
                
            })
                .catch(function (err) {
                    console.log(err);
                    
                })

            res.status(200).json({ receive: true });
        }).catch(()=>{
            res.status(500).json({ receive: false });
        });



    } catch (error) {
        console.log(error);
        res.status(500).json({ receive: false });
    }

});

module.exports = router;