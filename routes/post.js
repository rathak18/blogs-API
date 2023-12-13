// post.routes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.js');
const { authenticate } = require('../middleware/auth.js');

// Custom middleware for get, update, and delete routes

// Create a new blog post
router.post('/addBlog', authenticate, postController.createPost);
router.post('/addFakeBlog', postController.createFakePost);


// Get all blog posts
router.get('/getAllBlogs',authenticate, postController.getAllPosts);

// Get all blog posts datewise
router.get('/getAllBlogsDatewise',authenticate,postController.getAllBlogsDatewise);

// Get a specific blog post by ID
router.get('/getBlog/:id',authenticate, postController.getPostById);

// Update a blog post by ID
router.put('/updateBlog/:id',authenticate, postController.updatePostById);

// Delete a blog post by ID
router.delete('/deleteBlog/:id',authenticate, postController.deletePostById);

//delete all post

router.delete('/deleteAllPost',authenticate, postController.deleteAllPost);


router.get('/protected', authenticate, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
  });
  

module.exports = router;
