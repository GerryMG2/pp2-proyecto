process.on('message', (msg) => {
    console.log('Message from parent:', msg);
    try {
        init(msg);
    } catch (error) {
        process.send({finished: false, log: error});
    }
    
});


function init(data){
    setInterval(() => {
        process.send({finished: true});
      }, 1000);
}