const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection',(socket) => {
    console.log('user connected');
    
    socket.on('join-room',(roomID,userID)=>{
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('userConnected',userID)
        console.log("userID:" + userID);
        console.log("roomID:" + roomID);

        socket.to(roomID).on('chat', meetingchat => {
            console.log(meetingchat);
            io.to(roomID).emit('chat',meetingchat);
        })
        
    })

    socket.on('disconnect',() => {
        console.log('user disconnect');
    });
});

http.listen(3000, () => {
    console.log('listening on port 3000 ...');
});