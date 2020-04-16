const socket = io();

const $text = document.querySelector('#msg');
const $form = document.querySelector('#form');
const $formBtn = document.querySelector('#btn');
const $messages = document.querySelector('#messages');
const $usersList = document.querySelector('#usersList');
const $exitBtn = document.querySelector('#exitBtn');

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

const { name, room } = parseQuery(location.search);

socket.on('message', ({ text, name, id, createdAt }) => {
  const msg = document.createElement('div');
  const messageContent = document.createElement('p');
  messageContent.innerHTML = `${text}`;
  messageContent.classList.add('message');
  const messageTime = document.createElement('span');
  const messageUser = document.createElement('span');
  messageTime.innerHTML += `${createdAt}`;
  messageTime.classList.add('msg_meta');

  messageUser.innerHTML = name;
  messageUser.classList.add('msg_user');
  if (socket.id === id) {
    messageUser.classList.add('current');
  }

  msg.appendChild(messageUser);
  msg.appendChild(messageTime);
  msg.appendChild(messageContent);

  $messages.appendChild(msg);

  $messages.scrollTop = $messages.scrollHeight - $messages.clientHeight;
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

socket.emit('join', { name, room }, (error) => {
  if (error) {
    alert(error);
    location.replace('/');
  }
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
