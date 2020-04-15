const socket = io();

const $text = document.querySelector('#msg');
const $form = document.querySelector('#form');
const $formBtn = document.querySelector('#btn');
const $messages = document.querySelector('#messages');

const { user, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', ({ text, createdAt }) => {
  const msg = document.createElement('p');
  const messageContent = document.createElement('p');
  messageContent.innerHTML = `${text}`;
  messageContent.classList.add('message');
  const messageTime = document.createElement('span');
  const messageUser = document.createElement('span');
  messageTime.innerHTML += `${createdAt}`;
  messageTime.classList.add('msg_meta');

  messageUser.innerHTML = 'User Name';
  messageUser.classList.add('msg_user');

  msg.appendChild(messageUser);
  msg.appendChild(messageTime);
  msg.appendChild(messageContent);

  $messages.appendChild(msg);
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

socket.emit('join', { user, room });
