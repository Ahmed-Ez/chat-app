const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { addRoom } = require('../controllers/rooms');
const {
  registerUser,
  loginUser,
  getLoggedUser,
} = require('../controllers/auth');

//@Route GET /register
//@desc registration page
//@access public

router.route('/register').get((req, res) => {
  res.render('register');
});

//@Route Post /register
//@desc register user
//@access public
router.route('/register').post((req, res) => {
  const { name, email, password } = req.body;
  const getUser = async () => {
    const { user, error } = await registerUser(name, email, password);
    if (error) res.send(error);
    else res.redirect('/login');
  };
  getUser();
});

//@Route GET /login
//@desc login page
//@access public

router.route('/login').get((req, res) => {
  res.render('login');
});

//@Route post /login
//@desc login user
//@access public
router.route('/login').post((req, res) => {
  const { email, password } = req.body;
  const getUser = async () => {
    const user = await loginUser(email, password);
    if (user.user === null) {
      res.json({ token: null, error: user.error });
    } else {
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) return err;
          else {
            res.json({ token });
          }
        }
      );
    }
  };

  getUser();
});

//@Route get /logout
//@desc logout user
//@access private
router.route('/logout').get((req, res) => {
  res.render('logout');
});

//@Route GET /
//@desc User Home page
//@access private
router.route('/validate').get((req, res) => {
  const token = req.header('chat-token');
  if (!token) return res.json({ error: 'NOT AUTH' });
  const getUser = async (id) => {
    const user = await getLoggedUser(id);
    res.json({ user });
  };

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    if (decoded) {
      getUser(decoded.user.id);
    } else {
      res.json({ error: 'NOT AUTH' });
    }
  } catch (err) {
    if (!decoded) res.json({ user: null });
  }
});

//@Route GET /
//@desc User Home page
//@access private
router.route('/').get((req, res) => {
  res.render('index');
});

//@Route GET /create
//@desc create new room
//@access private
router.route('/create').get((req, res) => {
  res.render('create');
});

//@Route POST /create
//@desc create new room
//@access private
router.route('/create').post((req, res) => {
  const { room, id } = req.body;
  console.log(room, id);
  const addedRoom = async (room, id) => {
    const newRoom = await addRoom(room, id);
    console.log(newRoom);
    if (newRoom.room === null) {
      res.json({ error: newRoom.error });
    } else {
      res.json({ room: newRoom });
    }
  };
  addedRoom(room, id);
});

//@Route get /chat
//@desc chat page
//@access private
router.route('/chat').get((req, res) => {
  res.render('chat');
});

module.exports = router;
