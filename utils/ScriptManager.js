
const { fork, spawnSync } = require('child_process');

const dbs = require("./externalModels/dbs");
const errors = require("./externalModels/errors");
const request = require("request");
const { URL } = require("../config");
const fs = require("fs");
// const errors = require("../models/errors");



class ScriptManager {
    constructor() {

    }


    /**
     * 
     * @param {string} id 
     */
    static async run(obj) {

        console.log(obj);

        try {
            if (fs.existsSync("./Scripts/" + obj.script)) {
                console.log("exists");
                console.log("pre forked");
                let fun = require(`../Scripts/${obj.script}`)
                let ob = {
                    data: obj.data,
                    conn: obj.connection
                }

                var connect = require('camo').connect;
                const { URI_MONGO } = require("../config");
                var db;
                var uri = URI_MONGO;
                console.log(URI_MONGO);
                connect(uri).then(function (dbd) {
                    console.log("dentro del uri");
                    db = dbd;


                    console.log("entra al try")
                    dbs.findOne({ _id: msg.conn }).then((L) => {
                        console.log("antes de prostgresql");
                        let dbClass = require("../utils/postgres");
                        console.log(`postgresql://${L.username}:${L.password}@${L.host}:${L.port}/${L.database_name}${L.options}`);
                        let dbGenerator = new dbClass(`postgresql://${L.username}:${L.password}@${L.host}:${L.port}/${L.database_name}${L.options}`);
                        let auxdb = dbGenerator.getdb();

                        fun(msg.data, auxdb, (value, log) => {
                            console.log("log");
                            console.log(log);
                            auxdb.$pool.end();
                            if (value) {

                                return;
                            } else {
                                throw log.toString();
                            }
                        });





                    });
                }).catch((err) => {
                    console.log(err);
                    throw err.toString();
                });



            } else {
                console.log("no existe");
                let err = errors.create({
                    script: obj.script,
                    log: "el script no existe",
                    data: obj.data,
                    idTransaction: obj._id.id
                });

                err.save().then((L) => {
                    console.log(URL + '/adderrors');
                    request(URL + '/adderrors', function (error, response, body) {

                        console.log(error);
                        if (!error && response.statusCode == 200) {
                            console.log(body) // Print the google web page.
                        }
                    })
                    console.log("save Error");
                }).catch((err) => {
                    console.log(err);
                });
            }

        } catch (error) {
            console.log("error de script");
            console.log(error);
            let err = errors.create({
                script: obj.script,
                log: error,
                data: obj.data,
                idTransaction: obj._id.id
            });

            err.save().then((L) => {
                console.log(URL + '/adderrors');
                request(URL + '/adderrors', function (error, response, body) {
                    console.log(response);
                    console.log(error);
                    if (!error && response.statusCode == 200) {
                        console.log(body) // Print the google web page.
                    }
                })
                console.log("save Error");
            }).catch((err) => {
                console.log(err);
            });
        }






    }
}


module.exports = ScriptManager;