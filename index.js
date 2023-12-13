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
const Post = require('./models/post');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("DB connected");
  } catch (error) {
    console.error("Error connecting to DB:", error);
    process.exit(1);
  }
};

connectToDB();


// Middleware
app.use(bodyParser.json());
app.use(helmet())
app.use(globalLimiter)

// Enable CORS for all routes
app.use(cors());

// Use the "combined" pre-defined format
app.use(morgan('combined'));

app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Post.find({}, { title: 1, content: 1, author: 1, createdAt: 1 });
    res.render('blogs', { blogs }); // Render the 'blogs' view and pass the blogs data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.use('/api', postRoutes);
app.use('/api', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



module.exports = { app, mongoose };