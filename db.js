var connect = require('camo').connect;
const {URI_MONGO} = require("./config");
console.log(URI_MONGO);
var db;
var uri = URI_MONGO;
connect(uri).then(function(dbd) {
    db = dbd;
});

module.exports = db;

