const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { v4: uuidV4 } = require('uuid');

io.on('connection',(socket) => {
    console.log('user connected');
    io.emit('createRoom', uuidV4());
    
    socket.on('joinRoom',(roomID,userID)=>{
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('userConnected',userID)
        console.log("userID:" + userID);
        console.log("roomID:" + roomID);
    })
    socket.on('disconnect',() => {
        console.log('user disconnect');
    });
});

http.listen(3000, () => {
    console.log('listening on port 3000 ...');
});