const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { v4: uuidV4 } = require('uuid');

io.on('connection',(socket) => {
    console.log('user connected');
    socket.on('create-room',uuidV4());
    socket.on('disconnect',() => {
        console.log('user disconnect');
    });
});

http.listen(3000, () => {
    console.log('listening on port 3000 ...');
});