// post.routes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.js');

// Create a new blog post
router.post('/addBlog', postController.createPost);

// Get all blog posts
router.get('/getAllBlogs', postController.getAllPosts);

// Get a specific blog post by ID
router.get('/getBlog/:id', postController.getPostById);

// Update a blog post by ID
router.put('/updateBlog/:id', postController.updatePostById);

// Delete a blog post by ID
router.delete('/deleteBlog/:id', postController.deletePostById);

module.exports = router;
