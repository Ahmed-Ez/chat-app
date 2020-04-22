const token = localStorage.getItem('chat-token');
const getUser = async () => {
  const res = await axios.get('/validate', {
    headers: {
      'chat-token': token, //the token is a variable which holds the token
    },
  });
  const { name, rooms } = res.data.user.user;
};

if (token) {
  getUser();
} else {
  window.location.replace('/login');
}

const $rooms = document.querySelector('#rooms-collection');

const fillRooms = (rooms) => {
  rooms.forEach((room) => {});
};
