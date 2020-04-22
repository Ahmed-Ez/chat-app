const token = localStorage.getItem('chat-token');
const getUser = async () => {
  const res = await axios.get('/validate', {
    headers: {
      'chat-token': token, //the token is a variable which holds the token
    },
  });
  const { name, rooms, id } = res.data.user.user;
  console.log(name, rooms);
  fillRooms(rooms);
};

if (token) {
  getUser();
} else {
  window.location.replace('/login');
}

const $rooms = document.querySelector('#rooms-collection');
const fillRooms = async (rooms) => {
  rooms.forEach((room) => {
    $a = document.createElement('a');
    $a.setAttribute('href', `/chat?room=${room.name}`);
    $a.classList.add('collection-item');
    $a.innerHTML = `${room.name}`;
    $rooms.appendChild($a);
  });
};
