const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
const http = require('http');

const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/myapp'
});
const io = require('socket.io')(http);
const { v4: uuidV4 } = require('uuid');



io.on('connection',(socket) => {
    console.log('user connected');
    io.emit('createRoom', uuidV4(), socket.id);
    io.emit('getUserID', socket.id);
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

app.use('/peerjs', peerServer);

server.listen(3000);
/*
http.listen(3000, () => {
    console.log('listening on port 3000 ...');
});*/