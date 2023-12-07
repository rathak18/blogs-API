// app.js or index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/post.js');
const userRoutes = require('./routes/user.js');
const helmet = require('helmet');
const cors = require('cors'); // Import the cors middleware
const morgan = require('morgan');
const { globalLimiter, specificLimiter } = require('./utils/rateLimiter.js')
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("error connecting db", err);
  });

// Middleware
app.use(bodyParser.json());
app.use(helmet())
app.use(globalLimiter)

// Enable CORS for all routes
app.use(cors());

// Use the "combined" pre-defined format
app.use(morgan('combined'));

// Routes
app.use('/api', postRoutes);
app.use('/api', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
