const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection',(socket) => {
    console.log('user connected');

    socket.on('join-room',(roomID,userID)=>{
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('userConnected',userID)
        console.log("userID: " + userID);
        console.log("roomID: " + roomID);

        socket.to(roomID).on('chat', meetingchat => {
            console.log(meetingchat);
            io.to(roomID).emit('emitchat',meetingchat);
        })

        socket.to(roomID).on('vote', (question, option1, option2) => {
            console.log("question: " + question);
            console.log("option 1: " + option1);
            console.log("option 2: " + option2);
            io.to(roomID).emit('emitvote',question, option1, option2);
        })
        
    })

    socket.on('leave-room', (roomID,userID)=> {
        socket.leave(roomID)
        socket.to(roomID).broadcast.emit('userDisconnected',userID)
        console.log("leave meeting: " + userID);
    })

    socket.on('disconnect',() => {
        console.log('user disconnect');
    });
});

http.listen(3000, () => {
    console.log('listening on port 3000 ...');
});