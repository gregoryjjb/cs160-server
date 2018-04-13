var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'videos/'});
var fileUpload = require('express-fileupload');
var models = require('../models');
var authorization = require('../auth/authorization');

const util = require('util');
const exec = util.promisify(require('child_process').exec);
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
	/*const tempFilename = 'TEMP_' + filename;

	const finalPath = './videos/' + filename;
	const tempPath = './videos/' + tempFilename;

	console.log("Processing job requested for", filename);
	
	console.log("\tMoving file", tempPath);
	file.mv(tempPath);
	console.log("\tFinished move");

	const cvTempPath = __dirname + '/../videos/' + tempFilename;
	const cvFinalPath = __dirname + '/../videos/' + filename;
	
	console.log("\tStart processing");
	//const { stdout, stderr } = await exec(command, {cwd: './processing/cs160/CVProcessor/dist/Release/GNU-Linux/', maxBuffer: 1024 * 10000});
	const { stdout, stderr } = await processing.processFile(cvTempPath, cvFinalPath);
	console.log("\tEnd processing");
	
	//fs.writeFile('./output.txt', stdout, (err) => {});*/
	
	let processingData = await processing.processFile(file, filename);
	
	video = await video.update({path: '/api/videos/files/' + filename, data: processingData});
	
	res.send({});
})

router.route('/stream')
.get((req, res) => {
	res.send('Streaming will be here');
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
