var child_process = require('child_process');

var ss = require('socket.io-stream');
var fs = require('fs');
var devnull = require('dev-null');

module.exports = function(server) {
    const io = require('socket.io')(server);
    
    var ffmpeg = null;

    io.on('connection', socket => {
        console.log('User connected to socket');

        socket.on('disconnect', () => {
            console.log('User disconnected');
            if(ffmpeg && ffmpeg.kill) {
                console.log('Killing FFMPEG');
                ffmpeg.kill();
            }
        })

        ss(socket).on('vid', stream => {
            console.log('Got a stream!');
            stream.pipe(devnull());
            
            var timestamp = new Date().getTime();
            
            var args = ['-re', '-i', 'pipe:0', '-f', 'rtsp', `rtsp://localhost:5545/foo.mp4`];
            ffmpeg = child_process.spawn('ffmpeg', args);
            //ffmpeg.stdout.on('data', (data) => {console.log(data)});
            //ffmpeg.stderr.on('data', (data) => {console.log(data)});
            ffmpeg.stdout.pipe(process.stdout);
            ffmpeg.stderr.pipe(process.stderr);
            stream.pipe(ffmpeg.stdin);
            ffmpeg.stdin.on('error', err => {
                console.log("############################################# ERROR");
                console.log(err);
            })
            
            var cvArgs = ['-s', 'rtsp://localhost:5545/node.mp4'];
            
            // THIS IS FOR THE OLD WAY, USING STDIN AND OUT
            
            // Send stream to ffmpeg
            /*var args = ['-i', 'pipe:0', '-f', 'webm', '-vcodec', 'vp8', `pipe:1`];
            var ffmpeg = child_process.spawn('ffmpeg', args);
            ffmpeg.stdout.on('data', (data) => {console.log(data)});
            ffmpeg.stderr.on('data', (data) => {console.log(data)});
            stream.pipe(ffmpeg.stdin);
            
            ffmpeg.stdin.on('error', err => {
                console.log("############################################# ERROR");
                console.log(err);
            })*/
            
            // Send stream back to client
            /*var backStream = ss.createStream();
            ffmpeg.stdout.pipe(backStream);
            ss(socket).emit('vid-back', backStream);*/
            
            ffmpeg.on('close', code => {
                console.log("FFMPEG exited with code", code);
            })
            
            stream.on('end', () => {
                console.log('Stream ended');
            })
        })
    })
}