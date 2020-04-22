const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('chat-token');
  console.log(req.header);
  console.log(token);
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Not authorized' });
  }
};
