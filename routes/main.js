const express = require('express');
const router = express.Router();

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
  //TODO
});

//@Route get /chat
//@desc chat page
//@access private
router.route('/chat').get((req, res) => {
  res.render('chat');
});

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
  console.log(name, email, password);
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
  //TODO
});

//@Route get /logout
//@desc logout user
//@access private
router.route('/logout').get((req, res) => {
  //TODO
});

module.exports = router;
