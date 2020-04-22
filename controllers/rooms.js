const Room = require('../models/Room');
const User = require('../models/User');

exports.addRoom = async (name, id) => {
  let room = await Room.findOne({ name });
  if (room) return { room: null, error: 'room already Exists' };

  room = new Room({
    name,
  });

  await room.save();
  await User.update({ _id: id }, { $push: { rooms: room } });
  return room;
};
