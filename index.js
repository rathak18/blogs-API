const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Worker code
  const express = require('express');
  const mongoose = require('mongoose');
  const bodyParser = require('body-parser');
  const postRoutes = require('./routes/post.js');
  const userRoutes = require('./routes/user.js');
  const helmet = require('helmet');
  const cors = require('cors');
  const morgan = require('morgan');
  const { globalLimiter, specificLimiter } = require('./utils/rateLimiter.js');
  const Post = require('./models/post');
  require('dotenv').config();

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

  app.use(bodyParser.json());
  app.use(helmet());
  app.use(globalLimiter);
  app.use(cors());
  app.use(morgan('combined'));

  app.get('/blogs', async (req, res) => {
    try {
      const blogs = await Post.find({}, { title: 1, content: 1, author: 1, createdAt: 1 });
      res.render('blogs', { blogs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.use('/api', postRoutes);
  app.use('/api', userRoutes);

  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on port ${PORT}`);
  });
}
