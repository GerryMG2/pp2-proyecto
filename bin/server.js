#!/usr/bin/env node

/**
 * Module dependencies.
 */

 var {app,server,io} = require('../app');
 var debug = require('debug')('BroadCastNode:server');

 
 /**
  * Get port from environment and store in Express.
  */
 
 var port = normalizePort(process.env.PORT || '3000');
 app.set('port', port);
 
 /**
  * Create HTTP server.
  */
 

 
 module.exports.server = server;
 module.exports.port = port;
 module.exports.debug = debug;
 /**
  * Listen on provided port, on all network interfaces.
  */
  function normalizePort(val) {
   var port = parseInt(val, 10);
 
   if (isNaN(port)) {
     // named pipe
     return val;
   }
 
   if (port >= 0) {
     // port number
     return port;
   }
 
   return false;
 }
 
 
 
 