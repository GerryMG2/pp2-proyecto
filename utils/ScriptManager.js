
const { fork } = require('child_process');
const db = require("./dbM");
const errors = require("./externalModels/errors");
// const errors = require("../models/errors");

class ScriptManager {
    constructor(){

    }


    /**
     * 
     * @param {string} id 
     */
    static async run(obj) {
        
        console.log(obj);
       
        
        let forked = fork("./Scripts/" + obj.script);
        let ob = {
            data: obj.data,
            conn: obj.connection
        }
        forked.on("message", (msg) => {
            if(msg.send){
                forked.send(ob);
            }else{
                console.log("msg: ")
                console.log(msg);
                if(msg.status){
                    
                }else{
                    let err = errors.create({
                        script: obj.script,
                        log: msg.log,
                        data: obj.data,
                        idTransaction: obj._id.id
                    });
                    err.save().then((L)=>{
                        
                        console.log("save Error");
                    });
                }
                forked.kill(2);
            }
          
        });
        
        

    }
}


module.exports = ScriptManager;