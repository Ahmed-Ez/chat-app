const Room = require('../models/Room');
const User = require('../models/User');

exports.addRoom = async (name, id) => {
  let room = await Room.findOne({ name });
  if (room) {
  } else {
    room = new Room({
      name,
    });
    await room.save();
  }

  const user = await User.findOne({ _id: id });
  const exists = user.rooms.find((userRoom) => userRoom.name === room.name);
  if (!exists) {
    await User.update({ _id: id }, { $push: { rooms: room } });
  }

  return room;
};
