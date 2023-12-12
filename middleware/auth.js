// middleware/auth.js

const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');
const User = require('../models/user');

// Helper function to validate and decode JWT token
exports.decodeToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decodedToken.userId);

    // Check if the token is blacklisted
    const isBlacklisted = await TokenBlacklist.exists({ token });
    if (isBlacklisted) {
      throw new Error('Token is blacklisted');
    }

    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Helper function to add token to blacklist
exports.addToBlacklist = async (token) => {
  try {
    // Check if the token is already blacklisted
    const isBlacklisted = await TokenBlacklist.exists({ token });
    if (!isBlacklisted) {
      // If not blacklisted, add it to the blacklist
      await TokenBlacklist.create({ token });
    }
  } catch (error) {
    console.error('Error adding token to blacklist:', error);
  }
};

// Authentication middleware
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const user = await exports.decodeToken(token);

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await TokenBlacklist.exists({ token });
    if (isBlacklisted) {
      // Token is blacklisted, deny access
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

