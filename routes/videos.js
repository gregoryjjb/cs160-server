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
	const tempFilename = 'TEMP_' + filename;

	const finalPath = './videos/' + filename;
	const tempPath = './videos/' + tempFilename;

	console.log("MOVING TO", tempPath);
	file.mv(tempPath);
	console.log("FINISHED MOVE");

	const cvTempPath = __dirname + '/../videos/' + tempFilename;
	const cvFinalPath = __dirname + '/../videos/' + filename;

	const command = `./cvprocessor	-f "${cvTempPath}" -o "${cvFinalPath}"`;

	console.log("COMMAND: !!!!!!!!!!");
	console.log(command);
	console.log("ENDCOMMAND !!!!!!!!");


	console.log("BEGINNING PROCESSING");
	const { stdout, stderr } = await exec(command, {cwd: './processing/cs160/CVProcessor/dist/Release/GNU-Linux/', maxBuffer: 1024 * 10000});
	console.log("FINISHED PROCESSING");
	
	video = await video.update({path: '/api/videos/files/' + filename});

	fs.unlink(tempPath);
	
	res.send({});
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