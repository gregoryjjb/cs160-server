var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'videos/'});

var multiparty = require('multiparty');
var request = require('request');

var fileUpload = require('express-fileupload');
var models = require('../models');
var authorization = require('../auth/authorization');

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

//router.use(authorization);
//router.use(fileUpload());

router.use('/files', express.static(__dirname + '/../videos/'));

router.route('/')
.get((req, res) => {
    res.send("Videos go here")
})
.post(async (req, res) => {
	
	const {name} = req.body;
	
	//let video = await models.Video.create({ name, userId: res.locals.userId });
	
	var form = new multiparty.Form();
	
	form.parse(req, (err, fields, files) => {
		res.send("Parsed form");
		console.log("Parsed form");
	})
	
	form.on('file', (name, file) => {
		
		if(name != 'file') return;
		
		let stream = fs.createReadStream(file.path);
		
		stream.on('end', () => {
			console.log("Stream finished");
		})
		
		var formData = {
			file: {
				value:  stream,
				options: {
					filename: file.originalFilename
				}
			}
		};
		
		// Post the file to the upload server
		request.post({url: 'http://localhost:4001/', formData: formData});
	})
	
	
	//video = await video.update({path: '/api/videos/files/' + filename});

	//fs.unlink(tempPath);
	
	//res.send({});
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
