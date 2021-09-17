const transaction = require("../models/transactions");
const { fork } = require('child_process');
const errors = require("../models/errors");

class ScriptManager {
    constructor(){

    }


    /**
     * 
     * @param {transaction} options 
     */
    static async run(transaction) {
        console.log(transaction);
        // let forked = fork("../Scripts/" + transaction.script);
        // forked.on("message", (msg) => {
        //     console.log(msg);
        //     console.log("msg: ")
        //     console.log(msg);
        //     if(msg.finished){
        //         transaction.terminated = true;
        //     }else{
        //         let err = errors.create({
        //             script: transaction.script,
        //             log: msg.log,
        //             data: transaction.data
        //         });
        //         err.save().then((L)=>{
        //             console.log("save Error");
        //         });
        //     }
        //     forked.kill(2);
        // });
        // forked.send(transaction.data);

    }
}


module.exports = ScriptManager;