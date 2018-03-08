var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', async (req, res) => {

    var { sessionId } = req.cookies;

    await models.User.update({
        sessionId: null
    }, {
        where: {
            sessionId
        }
	});
	
	res.end();
});

module.exports = router;