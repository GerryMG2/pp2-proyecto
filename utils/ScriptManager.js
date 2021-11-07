
const { fork } = require('child_process');
const db = require("./dbM");
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
                let forked = fork("./Scripts/" + obj.script, [], {

                });
                let ob = {
                    data: obj.data,
                    conn: obj.connection
                }
                console.log("pro forked");

             

                forked.on("error", (erri) => {
                    console.log("error de script");
                    console.log(erri);
                    let err = errors.create({
                        script: obj.script,
                        log: erri,
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
                });
                console.log("pro2 forked");
                forked.on("message", (msg) => {
                    console.log("pro5 forked");
                    if (msg.send) {
                        forked.send(ob);
                    } else {
                        console.log("msg: ")
                        console.log(msg);
                        if (msg.status) {
                            console.log("estatus ok");
                        } else {

                            let err = errors.create({
                                script: obj.script,
                                log: msg.log,
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
                            });
                        }
                        forked.kill(2);
                    }

                });
                console.log("pro4 forked");
            }else{
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