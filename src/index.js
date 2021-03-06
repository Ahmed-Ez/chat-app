require('dotenv').config('');
const express = require('express');
const path = require('path');
const connection = require('../config/db');
const http = require('http');
const socketio = require('socket.io');
const bodyparser = require('body-parser');
const { addMessage } = require('../controllers/messages');
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
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json({ extended: false }));
app.set('view engine', 'ejs');

connection();

//ROUTES
app.use('/', require('../routes/main'));

//ADD MESSAGE TO DB
const addedMessage = async (msg, name, time, room) => {
  const message = await addMessage(msg, name, time, room);
};

//SOCKET
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
    io.to(user.room).emit('roomInfo', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  //Sending messages
  socket.on('sendMessage', (msg, callback) => {
    const user = getUser(socket.id);
    const time = new Date().getTime();
    addedMessage(msg, user.name, time, user.room);
    io.to(user.room).emit('message', genMessage(msg, user.name, user.id, time));
    callback();
  });

  //Disconnect
  socket.on('disconnect', () => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        genMessage(`${user.name} Has Left :( `, '')
      );
      removeUser(socket.id);
      io.to(user.room).emit('roomInfo', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
