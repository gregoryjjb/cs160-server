var models = require('../models');

const authorization = (req, res, next) => {
    
    var sessionId = req.headers.authorization;

    models.User.findOne({where: {
        sessionId: sessionId
    }})
    .then(user => {
        if(user) {
            res.locals.userId = user.id;
            next();
        }
        else {
            res.status(401).end('Access denied');
        }

        return null; // To avoid unreturned promise
    })
    .catch(error => {
        res.status(401).send('Access denied');
    });
}

module.exports = authorization;