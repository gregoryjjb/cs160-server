const util = require('util');
const exec = util.promisify(require('child_process').exec);
const child_process = require('child_process');
const ss = require('socket.io-stream');
const fs = require('fs');
const crypto = require('crypto');
const devnull = require('dev-null');

const config = {
    executable: './cvprocessor',
    cwd: './processing/cs160/CVProcessor/dist/Release/GNU-Linux/',
    rtspTarget: 'rtsp://localhost:5545',
    rtspSource: 'rtsp://localhost:554',
}

// Timestamp
const ts = () => (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ": ";

const processing = {};

processing.processFile = async function(file, filename) {
    
    const tempFilename = 'TEMP_' + filename;
    const finalFilename = filename.replace(/\.[^/.]+$/, "") + ".webm";
    
    const finalPath = './videos/' + finalFilename;
    const tempPath = './videos/' + tempFilename;
    
    console.log(ts() + "Processing job requested for", filename);
    console.log(ts() + "\tMoving file...")
    
    // Move unprocessed file into videos folder
    file.mv(tempPath);
    
    console.log(ts() + "\tFinished move");
    
    const cvTempPath = __dirname + '/../videos/' + tempFilename;
	const cvFinalPath = __dirname + '/../videos/' + finalFilename;
    const cvCommand = `./${config.executable}	-f "${cvTempPath}" -o "${cvFinalPath}"`;
    
    console.log(ts() + "\tStarting processing...");
    const { stdout, stderr } = await exec(cvCommand, {cwd: config.cwd, maxBuffer: 1024 * 10000});
    console.log(ts() + "Processing finished");
    
    // Delete temporary file
    fs.unlink(tempPath, (err) => {} );
    
    return {
        processingData: stdout,
        processedFilename: finalFilename
    };
}

function Stream(stream, callback) {
    // Stream names
    this.streamName = crypto.randomBytes(8).toString('hex') + '.mp4';
    this.rawStreamName = 'raw-' + this.streamName;
    
    console.log('Generated stream names:');
    console.log('\t' + this.rawStreamName);
    console.log('\t' + this.streamName);
    
    // Arguments
    this.streamToRtspArgs = ['-re', '-i', 'pipe:0', '-f', 'rtsp', '-muxdelay', '0.1', `${config.rtspTarget}/${this.rawStreamName}`];
    this.cvArgs = [
        '-s', `${config.rtspSource}/${this.rawStreamName}`,
        '-o', `pipe:1`,
        '-of', '-f webm -c:v vp8 -b:v .5M -g 1',
    ];
    
    // Child processes
    this.ffmpeg;
    this.cv;
    
    // Timeouts
    this.cvTO;
    
    // First FFMPEG
    this.ffmpeg = child_process.spawn('ffmpeg', this.streamToRtspArgs);
    stream.pipe(this.ffmpeg.stdin);
    this.ffmpeg.stdin.on('error', err => {
        console.log("FFMPEG stdin error: write pipe was probably closed");
        this.kill();
    });
    this.ffmpeg.on('close', code => console.log("FFMPEG exited with code", code));
    // Log
    //if(true) {
        this.ffmpeg.stdout.pipe(process.stdout);
        this.ffmpeg.stderr.pipe(process.stderr);
    //}
    
    // Run processing on RTSP
    this.cvTO = setTimeout(() => {
        this.cv = child_process.spawn(config.executable, this.cvArgs, {cwd: config.cwd});
        this.cv.on('close', (code, signal) => console.log('CVProcessor exited with code', code, 'signal', signal));
        
        //this.cv.stdout.pipe(process.stdout);
        
        var backStream = ss.createStream();
        this.cv.stdout.pipe(backStream);
        callback(backStream)
        
        // Log
        //if(true) {
            //this.cv.stdout.pipe(process.stdout);
            this.cv.stderr.pipe(process.stderr);
        //}
    }, 6000 );
}

Stream.prototype.kill = function() {
    
    if(this.ffmpeg && this.ffmpeg.kill) {
        console.log('Killing FFMPEG');
        this.ffmpeg.kill();
    }
    else {
        console.log('FFMPEG not started so not killed');
    }
    if(this.cv && this.cv.kill) {
        console.log('Killing CVProcessor');
        this.cv.kill();
    }
    else {
        console.log('CVProcessor not started so not killed');
    }
    
    clearTimeout(this.cvTO);
}

processing.Stream = Stream;

module.exports = processing;
