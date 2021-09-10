var connect = require('camo').connect;
 
var db;
var uri = 'nedb://data';
connect(uri).then(function(dbd) {
    database = dbd;
});

module.exports = db;

