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
 * }
 */
router.post('/', (req, res) => {
    const token = req.body.token;
    
    console.log("KEY", session.generateKey(token.substr(0, 30)));
    
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

module.exports = router;