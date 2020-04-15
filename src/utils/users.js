let users = [];

exports.addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const matchedUser = users.find((user) => {
    return user.name === name && user.room === room;
  });
  if (matchedUser) {
    return {
      error: 'User name already Exists in room',
    };
  }
  const user = {
    id,
    name,
    room,
  };
  users.push(user);
  return user;
};

exports.removeUser = (id) => {
  users = users.filter((user) => {
    return user.id != id;
  });
};

exports.getUser = (id) => {
  const user = users.find((user) => user.id === id);
  return user;
};

exports.getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

// addUser({
//   id: 20,
//   name: 'name1',
//   room: 'room1',
// });

// addUser({
//   id: 21,
//   name: 'name2',
//   room: 'room1',
// });
// addUser({
//   id: 30,
//   name: 'name30',
//   room: 'room2',
// });

// console.log(users);
// console.log('--------------------');

// console.log(getUser(30));

// console.log('--------------------');

// console.log(getUsersInRoom('room1'));
