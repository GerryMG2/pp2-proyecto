
const { fork } = require('child_process');
const errors = require("../models/errors");

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
        
            console.log("msg: ")
            console.log(msg);
            if(msg.status){
                
            }else{
                let err = errors.create({
                    script: obj.script,
                    log: msg.log,
                    data: obj.data,
                    idTransaction: obj._id
                });
                err.save().then((L)=>{
                    
                    console.log("save Error");
                });
            }
            forked.kill(2);
        });
        forked.send(ob);
        

    }
}


module.exports = ScriptManager;