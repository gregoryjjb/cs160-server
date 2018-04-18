/**
 * HTTP Server for API
 */

// Load ENV variables
const dotenv = require('dotenv');
dotenv.config();
dotenv.config({path: '.env.local'});

var http = require('http');
var fs = require('fs');
var streamSocket = require('./utils/stream-socket');
var models = require('./models');
var app = require('./app');

var port =  process.env.PORT || 4000;
var env = process.env.NODE_ENV || 'development';

///////////////////////////////////////////////////////
// Check for existance of cvprocessor

console.log("Searching for CVProcessor...");
fs.exists('./processing/cs160/CVProcessor/dist/Release/GNU-Linux/', exists => {
    if(exists) {
        console.log("\tCVProcessor found");
    }
    else {
        console.log("\tCVProcessor not found; clone the cs-160 repo into processing/");
    }
})

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