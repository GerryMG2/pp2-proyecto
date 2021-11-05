
const { fork } = require('child_process');
const db = require("./dbM");
const errors = require("./externalModels/errors");
const request = require("request");
const { URL } = require("../config");
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
            let forked = fork("./Scripts/" + obj.script);
            let ob = {
                data: obj.data,
                conn: obj.connection
            }
            forked.on("message", (msg) => {
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
                                console.log(response);
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
        } catch (error) {
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
            });
        }






    }
}


module.exports = ScriptManager;