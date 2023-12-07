const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/user.js');
const { authenticate } = require('../middleware/auth.js');

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Example protected route
router.get('/protected', authenticate, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
