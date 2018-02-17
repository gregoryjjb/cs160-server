/**
 * Express App for API
 */

var express = require('express');
var models = require('./models');
var app = express();


app.get('/', function(req, res) {
    res.send("Node API Running");
});

app.get('*', function(req, res) {
    res.status(404).send("404 Not Found");
});

app.use(express.static('www'));

// Error handling

function error(err, req, res, next) {
    // log it
    if (true) console.error(err.stack);
  
    // respond with 500 "Internal Server Error".
    res.status(500);
    res.send('500 Internal Server Error: ' + err.message);
}

app.use(error);

module.exports = app;