var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', (req, res) => {

    var sessionId = req.headers.authorization;

    models.User.update({
        sessionId: null
    }, {
        where: {
            sessionId: sessionId
        }
    })
        .then(() => {
            res.end();
        });
});

module.exports = router;