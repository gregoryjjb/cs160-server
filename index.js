/**
 * HTTP Server for API
 */

// Load ENV variables
const dotenv = require('dotenv');
dotenv.config();
dotenv.config({path: '.env.local'});

var http = require('http');
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

    var io = require('socket.io')(server);
    var ss = require('socket.io-stream');
    var fs = require('fs');

    io.on('connection', socket => {
        console.log('User connected to socket');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        })

        ss(socket).on('vid', stream => {
            console.log('Got a stream!');

        })
    })
});

module.exports = server;