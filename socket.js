const server = require("./bin/server");
const { Server } = require("socket.io");
const io = new Server(server);
const workerpool = require("workerpool");
const pool = workerpool.pool("./utils/worker.js");


io.on('connection', (socket) => {
  console.log('a user connected');
});

io.on('disconnect',(socket)=>{
    console.log("a user disconnected");
});

io.on("transaction", (trans)=>{
    try {
        console.log(trans);
        let tran = transaction.create({
            script: trans.script,
            data: trans.data,
            connection: trans.connection,
            terminated: false
        })

        tran.save().then((L) => {
            console.log(L);
            pool.exec('rune', [{script: L.script,data: L.data, connection: L.connection, _id: L._id}]).then(function (result) {
                console.log("resultado dentro del worker");
                
            })
                .catch(function (err) {
                    console.log(err);
                    
                })

            
        }).catch((e)=>{
            console.log(e)
        });



    } catch (error) {
        console.log(error);
       
    }
});