const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const utils = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

const { genMessage } = utils;

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('join', ({ user, room }) => {
    console.log(room);
    socket.join(room);
    socket.to(room).emit('message', genMessage('Welcome to the Chat !'));
    socket.broadcast
      .to(room)
      .emit('message', genMessage(`${user} Has Joined !`));
  });
  socket.on('sendMessage', (msg, callback) => {
    io.to('test').emit('message', genMessage(msg));
    callback();
  });
  socket.on('disconnect', () => {
    io.emit('message', genMessage('User Left !'));
  });
});

const port = process.env.PORT | 3000;

server.listen(3000, () => {
  console.log('App listening on port 3000!');
});
