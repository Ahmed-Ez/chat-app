const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const { genMessage } = require('./utils/messages');
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('Client connected');

  //Joining Room
  socket.on('join', ({ name, room }, callback) => {
    const user = addUser({ id: socket.id, name, room });
    if (user.error) {
      return callback(user.error);
    }
    socket.join(user.room);
    socket.broadcast
      .to(user.room)
      .emit('message', genMessage(`${user.name} Has Joined !`, ''));
    io.to(user.room).emit('roomUsers');
    callback();
  });

  //Sending messages
  socket.on('sendMessage', (msg, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', genMessage(msg, user.name, user.id));
    callback();
  });

  //Disconnect
  socket.on('disconnect', () => {
    const user = getUser(socket.id);
    if (user) {
      console.log(user);
      io.to(user.room).emit(
        'message',
        genMessage(`${user.name} Has Left :( `, '')
      );
      removeUser(socket.id);
    }
  });
});

const port = process.env.PORT | 3000;

server.listen(3000, () => {
  console.log('App listening on port 3000!');
});
