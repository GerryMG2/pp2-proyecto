var connect = require('camo').connect;
const {URI_MONGO} = require("../config");
var db;
var uri = URI_MONGO;
connect(uri).then(function(dbd) {
    db = dbd;
    
});


module.exports = db;

