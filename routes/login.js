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
    const sessionId = req.body.sessionId;
    
    if(token) {
        const sessionKey = session.generateKey(token.substr(0, 30))
        
        auth(token, (payload => {
            
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
            console.log("Login error", error.message);
            res.status(400).json({
                error: error.message
            });
        }));
    }
    else if(sessionId) {
        models.User.findOne({where: {
            sessionId: sessionId
        }})
        .then(user => {
            if(user) {
                res.json({
                    user: user,
                    firstLogin: false
                });
            }
            else {
                res.status(401).end();
            }
        })
        .catch(error => {
            res.status(400).end();
        });
    }
});

router.get('/logout', (req, res) => {

    var sessionId = req.headers.authorization;

    models.User.findOne({where: {
        sessionId: sessionId
    }})
    .then(user => {
        return user.updateAttributes({
            sessionId: null
        })
    })
    .catch(error => {
        res.status(400).end();
    })
    .then(() => {
        res.end();
    });
});

module.exports = router;