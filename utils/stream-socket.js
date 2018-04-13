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
            var args = ['-i', 'pipe:0', /*'-f', 'rawvideo', '-vcodec', 'rawvideo','-c', '-copy',*/ `./videos/ffmpegout_${timestamp}.avi`];
            
            /*var outputFilePath = `${__dirname}/../videos/ffmpegout_${timestamp}.avi`
            var cvArgs = ['-s', 'pipe:0', '-o', outputFilePath];
            var options = {cwd: './processing/cs160/CVProcessor/dist/Release/GNU-Linux/', maxBuffer: 1024 * 10000};*/
            
            var ffmpeg = child_process.spawn('ffmpeg', args);
            
            ffmpeg.stdout.on('data', (data) => {console.log(data)});
            ffmpeg.stderr.on('data', (data) => {console.log(data)});
            
            // we want to do:
            stream.pipe(ffmpeg.stdin);
            
            ffmpeg.stdin.on('error', err => {
                console.log("############################################# ERROR");
                console.log(err);
            })
            
            //let file = fs.createWriteStream(`./videos/streamed_${timestamp}`);
            //stream.pipe(file);
            
            stream.on('end', () => {
                file.close();
                console.log('Stream ended');
            })
        })
    })
}