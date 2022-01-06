
const { fork, spawnSync } = require('child_process');
const db = require("./dbM");
const dbs = require("./externalModels/dbs");
const errors = require("./externalModels/errors");
const request = require("request");
const { URL } = require("../config");
const fs = require("fs");
// const errors = require("../models/errors");



class ScriptManager {
    constructor() {

    }

    static #dbs = []
    /**
     * 
     * @param {string} id 
     */
    static async run(obj) {
        console.log("entra al scrip manager");
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
                console.log("antes de");
                console.log(this.#dbs);
                var dbp = this.#dbs.find((dbt) => {
                    if (dbt.id == ob.conn) {
                        return true;
                    }
                })
                console.log(" 1 antes de");
                if (dbp != undefined) {
                    console.log(" 2 antes de");
                    fun(ob.data, dbp.db, (value, log) => {
                        console.log("log");
                        console.log(log);
                        console.log(value);
                        if (value) {

                            return;
                        } else {
                            let err = errors.create({
                                script: obj.script,
                                log: log.toString(),
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
                                console.log("no save Error");
                                console.log(err);
                            });
                        }
                    });
                } else {
                    dbs.findOne({ _id: ob.conn }).then((L) => {
                        if (L != null) {
                            console.log("antes de prostgresql");
                            let dbClass = require("../utils/postgres");
                            console.log(`postgresql://${L.username}:${L.password}@${L.host}:${L.port}/${L.database_name}${L.options}`);
                            let dbGenerator = new dbClass(`postgresql://${L.username}:${L.password}@${L.host}:${L.port}/${L.database_name}${L.options}`);
                            let auxdb = dbGenerator.getdb();

                            this.#dbs.push({ id: ob.conn, db: auxdb });


                            fun(ob.data, auxdb, (value, log) => {
                                console.log("log");
                                console.log(log);
                                console.log(value);
                                if (value) {

                                    return;
                                } else {
                                    let err = errors.create({
                                        script: obj.script,
                                        log: log.toString(),
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
                                        console.log("no save Error");
                                        console.log(err);
                                    });
                                }
                            });
                        }else{
                            let err = errors.create({
                                script: obj.script,
                                log: 'La conexión a la base de datos no existe o no puedo realizarse.',
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
                                console.log("no save Error");
                                console.log(err);
                            });
                        }




                    });
                }



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
                log: error.toString(),
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






    }
}


module.exports = ScriptManager;