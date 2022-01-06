var connect = require('camo').connect;
const {URI_MONGO} = require("../config");
var db;
var uri = URI_MONGO;
var terminated = false;
connect(uri).then(function(dbd) {
    terminated = true;
    db = dbd;
    
});

module.exports.db = db;
module.exports.terminated = terminated;

