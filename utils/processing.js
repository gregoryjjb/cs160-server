const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

const config = {
    executable: 'cvprocessor',
    cwd: './processing/cs160/CVProcessor/dist/Release/GNU-Linux/',
}

// Timestamp
const ts = () => (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + ": ";

const processing = {};

processing.processFile = async function(file, filename) {
    
    const tempFilename = 'TEMP_' + filename;
    
    const finalPath = './videos/' + filename;
    const tempPath = './videos/' + tempFilename;
    
    console.log(ts() + "Processing job requested for", filename);
    console.log(ts() + "\tMoving file...")
    
    // Move unprocessed file into videos folder
    file.mv(tempPath);
    
    console.log(ts() + "\tFinished move");
    
    const cvTempPath = __dirname + '/../videos/' + tempFilename;
	const cvFinalPath = __dirname + '/../videos/' + filename;
    const cvCommand = `./${config.executable}	-f "${cvTempPath}" -o "${cvFinalPath}"`;
    
    console.log(ts() + "\tStarting processing...");
    const { stdout, stderr } = await exec(cvCommand, {cwd: config.cwd, maxBuffer: 1024 * 10000});
    console.log(ts() + "Processing finished");
    
    // Delete temporary file
    fs.unlink(tempPath, (err) => {} );
    
    return stdout;
}

module.exports = processing;