const token = localStorage.getItem('chat-token');
let id;
const getUser = async () => {
  const res = await axios.get('/validate', {
    headers: {
      'chat-token': token, //the token is a variable which holds the token
    },
  });
  id = res.data.user.user._id;
};

if (token) {
  getUser();
} else {
  window.location.replace('/login');
}

const $form = document.querySelector('#form');
const $room = document.querySelector('#room');

const getResponse = async (room, id) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const data = { room, id };

  try {
    const response = await axios.post('/create', data, config);
    if (response.data.error) {
      alert('Room already exists');
    } else {
      window.location.replace('/');
    }
  } catch (err) {
    console.log(err);
  }
};

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  const room = $room.value;
  getResponse(room, id);
});
