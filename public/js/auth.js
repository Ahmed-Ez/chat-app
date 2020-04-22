const $form = document.querySelector('#login-form');
const $email = document.querySelector('#email');
const $password = document.querySelector('#password');

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $email.value;
  const password = $password.value;
  getResponse(email, password);
});

const getResponse = async (email, password) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const user = { email: email, password: password };

  try {
    const response = await axios.post('/login', user, config);
    if (response.data.token === null) {
      alert('Invalid credentials');
      window.location.replace('/login');
    } else {
      localStorage.setItem('chat-token', response.data.token);
      window.location.replace('/');
    }
  } catch (err) {
    console.log(err);
  }
};
