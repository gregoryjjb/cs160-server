var child_process = require('child_process');

var ss = require('socket.io-stream');
var fs = require('fs');

module.exports = function(server) {
    const io = require('socket.io')(server);

    io.on('connection', socket => {
        console.log('User connected to socket');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        })

        ss(socket).on('vid', stream => {
            console.log('Got a stream!');
            
            var timestamp = new Date().getTime();
            //var args = ['-i', 'pipe:0', /*'-f', 'rawvideo', '-vcodec', 'rawvideo','-c', '-copy',*/ `./videos/ffmpegout_${timestamp}.avi`];
            var args = ['-i', 'pipe:0', '-f', 'webm', '-vcodec', 'vp8', `pipe:1`];
            
            /*var outputFilePath = `${__dirname}/../videos/ffmpegout_${timestamp}.avi`
            var cvArgs = ['-s', 'pipe:0', '-o', outputFilePath];
            var options = {cwd: './processing/cs160/CVProcessor/dist/Release/GNU-Linux/', maxBuffer: 1024 * 10000};*/
            
            /*var argsTEST = ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=avg_frame_rate,,width,height', '-of', 'default=noprint_wrappers=1:nokey=1', 'pipe:0'];
            var ffprobe = child_process.spawn('ffprobe', argsTEST);
            ffprobe.on('error', err => {
                console.log("TEST HAD ERR");
                console.log(err);
            })
            ffprobe.stdin.on('error', err => {
                console.log("TESTSTDIN HAD ERR");
                console.log(err);
            })
            stream.pipe(ffprobe.stdin);*/
            
            var ffmpeg = child_process.spawn('ffmpeg', args);
            
            ffmpeg.stdout.on('data', (data) => {console.log(data)});
            ffmpeg.stderr.on('data', (data) => {console.log(data)});
            
            // we want to do:
            stream.pipe(ffmpeg.stdin);
            
            ffmpeg.stdin.on('error', err => {
                console.log("############################################# ERROR");
                console.log(err);
            })
            
            var backStream = ss.createStream();
            ffmpeg.stdout.pipe(backStream);
            
            ss(socket).emit('vid-back', backStream);
            
            //let file = fs.createWriteStream(`./videos/streamed_${timestamp}`);
            //stream.pipe(file);
            
            stream.on('end', () => {
                file.close();
                console.log('Stream ended');
            })
        })
    })
}