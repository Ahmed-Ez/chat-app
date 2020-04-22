const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  user: {
    type: String,
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
