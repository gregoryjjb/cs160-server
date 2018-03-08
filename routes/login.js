var Sequelize = require('sequelize');
var express = require('express');
var router = express.Router();
var models = require('../models');
var parseToken = require('../auth/parse-token');
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
router.post('/', async (req, res) => {
    const { token, sessionId } = req.body;
	const ip = (
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress
	);
    
    if(token) {
        const sessionKey = session.generateKey(token.substr(0, 30))
        
        parseToken(token, (async payload => {
			
			const user = await models.User.findOne({
				where: { googleId: payload.sub }
			});
			
			if(user) {
				const updatedUser = await user.updateAttributes({
					sessionId: sessionKey,
					loginDate: new Date(),
					loginIP: ip
				});
				
				res.json({
					user: updatedUser,
					firstLogin: false
				});
			}
			else {
				const newUser = await models.User.create({
					googleId: payload.sub,
					firstname: payload.given_name,
					lastname: payload.family_name,
					email: payload.email,
					sessionId: sessionKey,
					loginIP: ip
				});
				
				res.json({
					user: newUser,
					firstLogin: true
				});
			}
            
        }), (error => {
            res.status(400).json({
                error: error.message
            });
        }));
    }
    else if(sessionId) {
        const user = await models.User.findOne({where: {
            sessionId: sessionId
        }})
        
		if(user) {
			res.json({
				user,
				firstLogin: false
			});
		}
		else {
			res.status(400).json({
				error: 'Session ID not found'
			});
		}
	}
	else {
		res.status(400).json({
			error: 'No session or token ID sent'
		});
	}
});

module.exports = router;