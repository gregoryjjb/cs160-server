/**
 * Express App for API
 */

var express = require('express');
var models = require('./models');
var auth = require('./auth/auth');
var app = express();

app.use(express.json());

app.get('/', function(req, res) {
    res.send("Node API Running");
});

app.get('/users', function(req, res) {
    models.User.findAll()
    .then(users => {
        res.json(users);
    })
});

app.post('/login', function(req, res) {
    var token = req.body.token;
    
    //console.log('Token:', token);
    
    auth(token, (payload => {
        console.log(payload.name);
        
        models.User.findOrCreate({
            where: {
                googleid: payload.sub
            },
            defaults: {
                firstname: payload.given_name,
                lastname: payload.family_name,
                email: payload.email
            }
        })
        .then(user => {
            res.json(user[0]);
        })
        
    }), (error => {
        res.end();
    }));
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