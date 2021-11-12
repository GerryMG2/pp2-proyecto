const { io } = require("./app");
const workerpool = require("workerpool");
const pool = workerpool.pool("./utils/worker.js",{maxWorkers: 2});
const transaction = require("./models/transactions");

console.log("io");
io.on('connection', (socket) => {
    console.log(socket.handshake.query.type);

    if (socket.handshake.query.type == "Monitor") {
        socket.join("monitors");
        var clients = io.sockets.adapter.rooms.get('apps');
        if(clients != undefined){
            clients.forEach((e) => {
                console.log(e);
                io.to(socket.id).emit("add_app",{id: e});
            })
            
        }
        
        
        
        
    }

    if (socket.handshake.query.type == "App") {
        socket.join("apps");
        io.to("monitors").emit("add_app",{id: socket.id});
        socket.on('disconnect', () => {
            
            io.to("monitors").emit("remove_app",{id: socket.id});
            console.log("a user disconnected");
        });

        socket.on("transaction", (trans) => {
            try {
                console.log("transaction " + trans);
                let tran = transaction.create({
                    script: trans.script,
                    data: trans.data,
                    connection: trans.connection,
                    terminated: false
                })
        
                tran.save().then((L) => {
                    console.log(L);
                    io.to("monitors").emit("add_transaction",{num: 1});
                    pool.exec('rune', [{ script: L.script, data: L.data, connection: L.connection, _id: L._id }]).then(function (result) {
                        console.log("resultado dentro del worker");
        
                    })
                        .catch(function (err) {
                            console.log(err);
        
                        })
        
        
                }).catch((e) => {
                    console.log(e)
                });
        
        
        
            } catch (error) {
                console.log(error);
        
            }
        });

    }


    console.log('a user connected');
});







module.exports.io = io;