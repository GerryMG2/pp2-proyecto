var express = require('express');
const dbs = require('../models/dbs');
const transaction = require('../models/transactions');
const ScriptManager = require('../utils/ScriptManager');
var router = express.Router();
const workerpool = require("workerpool");
const pool = workerpool.pool("./utils/worker.js");
const scriptFolder = './Scripts/';
const fs = require('fs');

router.get("/:id", function (req, res, next) {
    try {
        console.log(req.params.id);
        const buffer = fs.readFileSync("./Scripts/" +req.params.id + ".js");

        // use the toString() method to convert
        // Buffer into String
        const fileContent = buffer.toString();
        console.log(fileContent);
        res.render('scriptsCreate', { title: 'scripts', model: {name: req.params.id}, content: fileContent });

    } catch (error) {
        console.log(error);
        res.render('scriptsCreate', { title: 'scripts', model: {}, content: "" });
    }

});


router.get("/", function (req, res, next) {
    var aux = []
    try {
        fs.readdir(scriptFolder, (err, files) => {
            files.forEach(file => {
                console.log(file);
                if (file != "lib.js" && file != "scriptPrueba") {
                    aux.push(file);
                }

            });
            console.log(aux);
            res.render('scripts', { title: 'scripts', model: {}, list: aux });
        });
    } catch (error) {
        res.render('scripts', { title: 'scripts', model: {}, list: aux });
    }


});

module.exports = router;