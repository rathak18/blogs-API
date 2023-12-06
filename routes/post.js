// post.routes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.js');
const customMiddleware = require('../middleware/auth.js'); // Adjust the path accordingly


// Custom middleware for get, update, and delete routes

// Create a new blog post
router.post('/addBlog', postController.createPost);

// Get all blog posts
router.get('/getAllBlogs',customMiddleware, postController.getAllPosts);

// Get all blog posts datewise
router.get('/getAllBlogsDatewise',customMiddleware,postController.getAllBlogsDatewise);

// Get a specific blog post by ID
router.get('/getBlog/:id', postController.getPostById);

// Update a blog post by ID
router.put('/updateBlog/:id', postController.updatePostById);

// Delete a blog post by ID
router.delete('/deleteBlog/:id', postController.deletePostById);

module.exports = router;
