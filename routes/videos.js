var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var models = require('../models');
var authorization = require('../auth/authorization');

const child_process = require('child_process');
const fs = require('fs');

const processing = require('../utils/processing');

router.use(authorization);
router.use(fileUpload());

router.use('/files', express.static(__dirname + '/../videos/'));

router.route('/')
.get((req, res) => {
    res.send("Videos go here")
})
.post(async (req, res) => {
	
	const {name} = req.body;
	const {file} = req.files;
	
	let video = await models.Video.create({ name, userId: res.locals.userId });
	
	const filename = video.id + '_' + file.name;
	
	let processingData = await processing.processFile(file, filename);
	
	video = await video.update({
		filename,
		path: '/api/videos/files/' + filename,
		data: processingData,
	});
	
	res.send({});
})

router.route('/:userId')
.get(async (req, res) => {
    
    const { userId } = res.locals;
    
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
.delete(async (req, res) => {
	
	const { userId, videoId } = req.params;
	
	const video = await models.Video.findOne({
        where: {
			id: videoId,
			userId
        }
	});
	
	const filePath = './videos/' + video.filePath;
	
	if(video) {
		if(video.filename && fs.existsSync(filePath)) {
			fs.unlink(filePath);
		}
		
		await video.destroy();
		res.status(204).end();
	}
	else {
		res.status(404).send('Video not found');
	}
})



module.exports = router;
