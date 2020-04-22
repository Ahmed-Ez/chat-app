const token = localStorage.getItem('chat-token');
let user;

function parseQuery(queryString) {
  var query = {};
  var pairs = (queryString[0] === '?'
    ? queryString.substr(1)
    : queryString
  ).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

const addMessage = (text, name, createdAt) => {
  const msg = document.createElement('div');
  const messageContent = document.createElement('p');
  messageContent.innerHTML = `${text}`;
  messageContent.classList.add('message');
  const messageTime = document.createElement('span');
  const messageUser = document.createElement('span');
  messageTime.innerHTML += `${new Date(Number(createdAt)).toLocaleString()}`;
  messageTime.classList.add('msg_meta');

  messageUser.innerHTML = name;
  messageUser.classList.add('msg_user');
  if (name === user.name) {
    messageUser.classList.add('current');
  }

  msg.appendChild(messageUser);
  msg.appendChild(messageTime);
  msg.appendChild(messageContent);

  $messages.appendChild(msg);

  $messages.scrollTop = $messages.scrollHeight - $messages.clientHeight;
};

const getUser = async () => {
  const res = await axios.get('/validate', {
    headers: {
      'chat-token': token, //the token is a variable which holds the token
    },
  });
  user = res.data.user.user;
  const { room } = parseQuery(location.search);
  const name = user.name;

  socket.emit('join', { name, room }, (error) => {
    if (error) {
      alert(error);
      location.replace('/');
    }
  });
  getMessages(room);
};

const getMessages = async (room) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const data = { room };

  try {
    const response = await axios.post('/messages', data, config);
    const messages = response.data.messages;
    console.log(messages);
    messages.forEach((message) =>
      addMessage(message.content, message.user, message.time)
    );
  } catch (err) {
    console.log(err);
  }
};

if (token) {
  getUser();
} else {
  window.location.replace('/login');
}

const socket = io();

const $text = document.querySelector('#msg');
const $form = document.querySelector('#form');
const $formBtn = document.querySelector('#btn');
const $messages = document.querySelector('#messages');
const $usersList = document.querySelector('#usersList');
const $exitBtn = document.querySelector('#exitBtn');

socket.on('message', ({ text, name, id, createdAt }) => {
  addMessage(text, name, createdAt);
});

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  $formBtn.setAttribute('disabled', 'true');
  let msg = $text.value;
  socket.emit('sendMessage', msg, () => {
    $formBtn.removeAttribute('disabled');
    $text.value = '';
    $text.focus();
  });
});

socket.on('roomInfo', ({ room, users }) => {
  const $header = document.querySelector('#header');
  room = room.replace(room[0], room[0].toUpperCase());
  $header.innerHTML = room;

  //update users list
  $usersList.innerHTML = '';
  users.forEach((user) => {
    const $icon = document.createElement('i');
    $icon.innerHTML = 'insert_emoticon';
    $icon.classList.add('material-icons');
    const $name = document.createElement('span');
    $name.innerHTML = user.name;
    const $li = document.createElement('li');
    $li.appendChild($icon);
    $li.appendChild($name);
    $usersList.appendChild($li);
  });
});

$exitBtn.addEventListener('click', (e) => {
  location.replace('/');
});
