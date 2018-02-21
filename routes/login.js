var Sequelize = require('sequelize');
var express = require('express');
var router = express.Router();
var models = require('../models');
var auth = require('../auth/auth');
var session = require('../auth/session');

/** 
 * Log in to backend server
 */

/** 
 * Required body: {
 *   token: ID_TOKEN
 *   OR (@todo)
 *   session: SESSION_ID (for continuing an old session)
 * }
 */
router.post('/login', (req, res) => {
    const token = req.body.token;
    
    const sessionKey = session.generateKey(token.substr(0, 30))
    console.log("KEY", sessionKey);
    
    auth(token, (payload => {
        console.log(payload.name);
        
        models.User.findOne({
            where: { googleId: payload.sub }
        })
        .then(user => {
            if(user) {
                // Update session and login time of existing user
                user.updateAttributes({
                    sessionId: sessionKey,
                    loginDate: new Date()
                }) 
                .then(user => {
                    res.json({
                        user: user,
                        firstLogin: false
                    });
                })
            }
            else {
                // Create new user for first login
                models.User.create({
                    googleId: payload.sub,
                    firstname: payload.given_name,
                    lastname: payload.family_name,
                    email: payload.email,
                    sessionId: sessionKey
                })
                .then(user => {
                    res.json({
                        user: user,
                        firstLogin: true
                    });
                })
            }
        });
        
    }), (error => {
        console.log("LOGIN SAW ERROR", error.message);
        res.status(400).json({
            error: error.message
        });
    }));
});

router.get('/logout', (req, res) => {

    var sessionId = req.headers.authorization;

    models.User.findOne({where: {
        sessionId: sessionId
    }})
    .then(user => {
        user.updateAttributes({
            sessionId: null
        })
        .then(() => {
            res.end();
        });
    })
    .catch(error => {
        res.status(400).end();
    });
});

module.exports = router;