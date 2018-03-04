/**
 * HTTP Server for API
 */

var http = require('http');
var models = require('./models');
var app = require('./app');

var port =  process.env.PORT || 4000;
var env = process.env.NODE_ENV || 'development';

// Create HTTP server
var server;

models.sequelize.sync()
.then(() => {
    server = http.createServer(app);
    server.listen(port);
    
    console.log("HTTP Server listening");
    console.log("\tPort:", port);
    console.log("\tEnvironment:", env);
});

module.exports = server;