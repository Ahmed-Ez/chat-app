const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  messages: {
    type: Array,
  },
});

module.exports = mongoose.model('room', roomSchema);
