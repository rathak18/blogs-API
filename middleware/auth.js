const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Authentication middleware
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
