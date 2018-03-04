/**
 * Express App for API
 */

var express = require('express');
var models = require('./models');

var app = express();
app.use(express.json());

var api = express.Router();

var login = require('./routes/login');
var logout = require('./routes/logout');
var videos = require('./routes/videos');
// Other API routes here

api.use('/login', login);
api.use('/logout', logout);
api.use('/videos', videos);
api.get('/', function(req, res) {
    res.send("Node API running!");
});

app.use('/api', api);

app.get('/', function(req, res) {
    res.send("Node server running!");
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