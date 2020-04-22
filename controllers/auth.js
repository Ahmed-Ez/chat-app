const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.registerUser = async (name, email, password) => {
  try {
    let user = await User.findOne({ email });
    let error;

    if (user) return { user: null, error: 'Email already Exists' };

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    return { user, error };
  } catch (err) {
    console.log(err);
    return err;
  }
};

exports.loginUser = async (email, password) => {
  try {
    let user = await User.findOne({ email });
    let error;
    if (!user)
      return {
        user: null,
        error: 'Invalid credentials',
      };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return {
        user: null,
        error: 'invalid Credentials',
      };

    return user;
  } catch (err) {
    console.log(err);
  }
};

exports.getLoggedUser = async (id) => {
  try {
    const user = await User.findById(id).select('-password');
    let error;
    return { user, error };
  } catch (err) {
    console.error(err.message);
    return { error: err.message, user };
  }
};
