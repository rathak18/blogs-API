// post.controller.js
const Post = require('../models/post.js');

// Controller to create a new blog post
exports.createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if(!title) return res.status(400).json({message: "Please provide title for the blog"})
    if(!content) return res.status(400).json({message: "Please provide content for the blog"})
    if(!author) return res.status(400).json({message: "Please provide author for the blog"})
    const newPost = new Post({ title, content, author });
    const savedPost = await newPost.save();
    res.status(201).json({ message: "Blog created successfully", savedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get all blog posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    if(!posts) res.status(404).json({message:"blogs not available"})
    res.status(200).json({messgae: "blogs feched successfully",posts});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get a specific blog post by ID
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to update a blog post by ID
exports.updatePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, author } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, content, author },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to delete a blog pos
exports.deletePostById = async (req, res) => {
    try {
      const postId = req.params.id;
      const deletedPost = await Post.findByIdAndDelete(postId);
      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };