// const db = require("./dbM");

const dbs = require("./externalModels/dbs");




function init(run) {
    var connect = require('camo').connect;
    const { URI_MONGO } = require("../config");
    var db;
    var uri = URI_MONGO;
    console.log(URI_MONGO);
    connect(uri).then(function (dbd) {
        console.log("dentro del uri");
        db = dbd;
        process.send({send: true});
        process.on('message', (msg) => {
            console.log('Message from parent:', msg);
            try {
                console.log("entra al try")
                dbs.findOne({ _id: msg.conn }).then((L) => {
                    console.log("antes de prostgresql");
                    let dbClass = require("../utils/postgres");
                    console.log(`postgresql://${L.username}:${L.password}@${L.host}:${L.port}/${L.database_name}${L.options}`);
                    let dbGenerator = new dbClass(`postgresql://${L.username}:${L.password}@${L.host}:${L.port}/${L.database_name}${L.options}`);
                    let auxdb = dbGenerator.getdb();
    
                    run(msg.data, auxdb, (value, log) => {
                        console.log("log");
                        console.log(log);
                        auxdb.$pool.end();
                        if (value) {
    
                            process.send({ status: true })
                        } else {
                            process.send({ status: false, log: log.toString() });
                        }
                    });
    
                }).catch((err) => {
                    console.log("no existe la conexion");
                    console.log(err.toString());
                    process.send({ status: false, log: "no existe la conexion" });
                });
    
    
    
            } catch (error) {
                console.log(error);
                process.send({ status: false, log: error });
            }
    
        });
    }).catch((err)=>{
        console.log(err);
        process.send({ status: false, log: err });
    });

   
}

const blitz = {
    init: init,

}

module.exports = blitz;