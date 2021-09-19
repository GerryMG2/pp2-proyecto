const db = require("../db");

const dbs = require("../models/dbs");




function init(run) {
    process.on('message', (msg) => {
        console.log('Message from parent:', msg);
        try {
            dbs.findOne({ _id: msg.conn }).then((L) => {
                let dbClass = require("../utils/postgres");
                console.log(`postgresql://${L.username}:${L.password}@${L.host}:${L.port}/${L.database}`);
                let dbGenerator = new dbClass(`postgresql://${L.username}:${L.password}@${L.host}:${L.port}/${L.database}`);
                let auxdb = dbGenerator.getdb();

                run(msg.data, auxdb, (value, log) => {
                    if (value) {
                        auxdb.$pool.end();
                        process.send({status: true})
                    } else {
                        process.send({status: false, log: log});
                    }
                });

            }).catch((err) => {
                console.log(err);
                process.send({status: false, log: err});
            });



        } catch (error) {
            process.send({status: false, log: error});
        }

    });
}

const blitz = {
    init: init,

}

module.exports = blitz;