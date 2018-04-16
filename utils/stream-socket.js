var child_process = require('child_process');

var ss = require('socket.io-stream');
var fs = require('fs');
var devnull = require('dev-null');

const processing = require('./processing');

module.exports = function(server) {
    const io = require('socket.io')(server);

    io.on('connection', socket => {
        console.log('User connected to socket');
        
        var streamProcess;

        socket.on('disconnect', () => {
            console.log('User disconnected');
            
            if(streamProcess) streamProcess.kill();
        })

        ss(socket).on('vid', stream => {
            console.log('Got a stream!');
            stream.pipe(devnull());
            
            var timestamp = new Date().getTime();
            
            streamProcess = new processing.Stream(stream, backStream => {
                ss(socket).emit('vid-back', backStream);
            })
            
            /*var args = ['-re', '-i', 'pipe:0', '-f', 'rtsp', '-muxdelay', '0.1', `rtsp://localhost:5545/foo.mp4`];
            ffmpeg = child_process.spawn('ffmpeg', args);
            //ffmpeg.stdout.on('data', (data) => {console.log(data)});
            //ffmpeg.stderr.on('data', (data) => {console.log(data)});
            ffmpeg.stdout.pipe(process.stdout);
            ffmpeg.stderr.pipe(process.stderr);
            stream.pipe(ffmpeg.stdin);
            ffmpeg.stdin.on('error', err => {
                console.log("! FFMPEG stdin error: write pipe was probably closed");
            })
            
            setTimeout(() => {
                var cvArgs = ['-s', 'rtsp://localhost:554/foo.mp4'];
                cv = child_process.spawn('./cvprocessor', cvArgs, {cwd: './processing/cs160/CVProcessor/dist/Debug/GNU-Linux/'});
                cv.stdout.pipe(process.stdout);
                cv.stderr.pipe(process.stderr);
                cv.on('close', (code, signal) => console.log('CVProcessor exited with code', code, 'signal', signal));
            }, 6000 );
            
            setTimeout(() => {
                var fbackArgs = ['-i', 'rtsp://localhost:554/processed.mp4', '-f', 'webm', '-vcodec', 'vp8', 'pipe:1'];
                ffmpeg2 = child_process.spawn('ffmpeg', fbackArgs);
                
                var backStream = ss.createStream();
                ffmpeg2.stdout.pipe(backStream);
                ss(socket).emit('vid-back', backStream);
                
            }, 12000 );*/
            
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
            
            stream.on('end', () => {
                console.log('Stream ended');
            })
        })
    })
}