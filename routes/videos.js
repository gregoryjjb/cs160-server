var express = require('express');
var router = express.Router();
var models = require('../models');
var authorization = require('../auth/authorization');

router.use(authorization);

router.route('/')
.get((req, res) => {
    res.send("Videos go here")
})
.post((req, res) => {
    /** 
     * body: {
     *   videoData: {
     *     name: NAME
     *   }
     * }
     */

    var videoData = {
        name: req.body.videoData.name,
        userId: res.locals.userId
    }

    //console.log("Would make new video", videoData);

    models.Video.create(videoData)
    .then(video => {
        res.json(video);
    })
    .catch(error => {
        res.end();
    })
})

router.route('/:userId')
.get((req, res) => {
    
    var userId = res.locals.userId; //req.params.userId;
    
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