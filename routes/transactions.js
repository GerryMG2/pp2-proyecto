var express = require('express');
const dbs = require('../models/dbs');
const transaction = require('../models/transactions');
const ScriptManager = require('../utils/ScriptManager');
var router = express.Router();
const workerpool = require("workerpool");
const pool = workerpool.pool("./utils/worker.js",{maxWorkers: 1});
const errors = require("../models/errors");



router.post("/transaction", function (req, res, next) {
    var io = req.app.get('socketio');
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
            io.to("monitors").emit("add_transaction",{num: 1, stats: pool.stats()});
            res.status(200).json({ receive: true });
            
            pool.exec('rune', [{script: L.script,data: L.data, connection: L.connection, _id: L._id}]).then(function (result) {
                console.log("resultado dentro del worker");
                
            })
                .catch(function (err) {
                    console.log(err);
                    
                })

            
        }).catch((e)=>{
            console.log(e);
            res.status(500).json({ receive: false });
        });



    } catch (error) {
        console.log(error);
        res.status(500).json({ receive: false });
    }

});


router.get("/transactions",function(req,res,next){
    try {
        console.log("transacciones");
        transaction.count({}).then((num) => {
            errors.count({}).then((numerr) => {
                res.status(200).json({transacciones: num,errores: numerr});
            }).catch((err) =>{
                throw "error obteniendo el numero de errores";
            })
        }).catch((err)=>{
            throw "error obteniendo el numero de transacciones";
        });
      


    } catch (error) {
        console.log(error);
        res.status(500).json({transacciones: 0,errores: 0});
    }
});


router.get("/stats",function(req,res,next){
    res.status(200).json( pool.stats());
})
module.exports = router;