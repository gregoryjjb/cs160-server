/**
 * HTTP Server for API
 */

// Load ENV variables
const dotenv = require('dotenv');
dotenv.config();
dotenv.config({path: '.env.local'});

var http = require('http');
var streamSocket = require('./utils/stream-socket');
var models = require('./models');
var app = require('./app');

var port =  process.env.PORT || 4000;
var env = process.env.NODE_ENV || 'development';

///////////////////////////////////////////////////////
// Do socket stuff


///////////////////////////////////////////////////////

// Create HTTP server
var server;

models.sequelize.sync()
.then(() => {
    server = http.createServer(app);
    server.listen(port);
    
    console.log("HTTP Server listening");
    console.log("\tPort:", port);
    console.log("\tEnvironment:", env);

    var io = streamSocket(server);
});

module.exports = server;