var express = require('express');
var router = express.Router();
var models = require('../models');
var authorization = require('../auth/authorization');

router.use(authorization);

router.route('/')
.get((req, res) => {
    res.send("Videos go here")
})
.post(async (req, res) => {
    /** 
     * body: {
     *   videoData: {
     *     name: NAME
     *   }
     * }
     */

    const videoData = {
        name: req.body.videoData.name,
        userId: res.locals.userId
	}
	
    const video = await models.Video.create(videoData);
	
	res.send(video);
})

router.route('/:userId')
.get(async (req, res) => {
    
    const { userId } = res.locals; //req.params.userId;
    
    const videos = await models.Video.findAll({
        where: { userId }
	});
	
	res.send(videos);
})

router.route('/:userId/:videoId')
.get(async (req, res) => {
    
	const { userId, videoId } = req.params;
    
    const video = await models.Video.findOne({
        where: {
			id: videoId,
			userId
        }
	});
	
	if(video) {
		res.send(video);
	}
	else {
		res.status(404).send('Video not found');
	}
})

module.exports = router;