var models = require('../models');

const authorization = async (req, res, next) => {
    
    var { sessionId } = req.cookies;

    if(sessionId) {
        user = await models.User.findOne({where: {
            sessionId: sessionId
		}});
		
		if(user) {
			res.locals.userId = user.id;
			next();
		}
		else {
			res.status(401).end('Access denied');
		}
    }
    else {
        res.status(401).end('Access denied');
    }
}

module.exports = authorization;