const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    refs: 'rooms',
  },
  content: {
    type: String,
    required: true,
  },
  time: {
    type: String,
  },
});

module.exports = mongoose.model('message', messageSchema);
