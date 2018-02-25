var express = require('express');
var router = express.Router();
var models = require('../models');

router.route('/')
.get((req, res) => {
    res.send("Videos go here")
})

router.route('/:userId')
.get((req, res) => {
    
    var userId = req.params.userId;
    
    models.Video.findAll({
        where: {userId: userId}
    })
    .then(videos => {
        res.send(videos);
    })
})

router.route('/:userId/:videoId')
.get((req, res) => {
    var userId = req.params.userId;
    var videoId = req.params.videoId;
    
    models.Video.findOne({
        where: {
            id: videoId,
            userId: userId
        }
    })
    .then(video => {
        
        if(video) {
            res.send(video);
        }
        else {
            res.status(404).send('Video not found');
        }
    })
})

module.exports = router;