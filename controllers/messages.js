const Message = require('../models/Message');
const Room = require('../models/Room');

exports.addMessage = async (content, name, time, room) => {
  const message = new Message({
    user: name,
    content,
    time,
  });

  await message.save();
  await Room.update({ name: room }, { $push: { messages: message } });
  return message;
};

exports.getMessages = async (room) => {
  const msgRoom = await Room.findOne({ name: room });
  return msgRoom.messages;
};
