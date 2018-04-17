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
            console.log('User disconnected from socket');
            
            if(streamProcess) streamProcess.kill();
        })

        ss(socket).on('vid', stream => {
            console.log('Received a live stream');
            stream.pipe(devnull());
            
            var timestamp = new Date().getTime();
            
            streamProcess = new processing.Stream(stream, backStream => {
                ss(socket).emit('vid-back', backStream);
            })
            
            stream.on('end', () => {
                console.log('Stream ended');
            })
        })
    })
}