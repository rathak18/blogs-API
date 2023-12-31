const Post = require('../models/post.js');
const User = require('../models/user.js');
const faker = require('faker');

// Controller to create a new blog post
exports.createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) { 
      return res.status(400).json({ success: false, message: "Please provide title, content, and author for the blog" });
    }
    const newPost = new Post({ title, content, author ,  user: req.user._id});
    const savedPost = await newPost.save();
    res.status(201).json({ success: true, message: "Blog created successfully", savedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.createFakePost = async (req, res) => {
  try {
    const blogs = [];
    const numBlogs = 1000;

    for (let i = 0; i < numBlogs; i++) {
      // Generate user data or fetch an existing user
      const user = await User.findOne(); // You should replace this with your actual method to get user data

      const blog = {
        title: faker.lorem.words(),
        content: faker.lorem.paragraphs(),
        author: faker.name.findName(),
        user: user._id, // Assuming user._id is the ID of the user associated with the blog
      };
      blogs.push(blog);
    }

    console.log(blogs);

    await Post.insertMany(blogs);
    res.status(201).json({ success: true, message: `${numBlogs} blogs created successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get all blog posts

exports.getAllPosts = async (req, res, next) => {
  try {
    // Extract title, content, author, blogId, page, and limit from the request query
    const { title, content, author, blogId, page = 1, limit = 10 } = req.body;
  
    // Validate page and limit
    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: "Invalid page or limit values" });
    }

    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;

    // Build the filter object based on the provided parameters
    const filter = {};
    
    if (title) {
      filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search using regex
    }
    if (content) {
      filter.content = { $regex: content, $options: 'i' };
    }
    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }
    if (blogId) {
      filter._id = blogId;
    }

    // If req.user is available and contains the user ID, add it to the filter
    if (req.user && req.user._id) {
      filter.user = req.user._id;
    }

    // Fetch posts based on the constructed filter with pagination
    const posts = await Post.find(filter, { title: 1, content: 1, author: 1, _id: 1, createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .sort({_id: -1});

    if (!posts.length) {
      return res.status(404).json({ message: "Blogs not available" });
    }

    res.status(200).json({ message: "Blogs fetched successfully", posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





exports.getAllBlogsDatewise = async (req, res) => {
  try {
    // Extract date and toDate parameters from the request query
    const { fromDate, toDate } = req.body;

    // Validate date and toDate parameters
    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "Both date and toDate parameters are required" });
    }

    // Parse the date strings into Date objects
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    // Validate that startDate is before or equal to endDate
    if (startDate > endDate) {
      return res.status(400).json({ message: "startDate must be before or equal to endDate" });
    }

    // Build the filter object based on the date range
    const filter = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    if (req.user && req.user._id) {
      filter.user = req.user._id;
    }

    // Fetch posts based on the constructed filter
    const posts = await Post.find({...filter, },{ title: 1, content: 1, author: 1, _id: 1, createdAt: 1 });

    if (!posts.length) {
      return res.status(404).json({ message: "No blogs found within the specified date range" });
    }

    res.status(200).json({ message: "Blogs fetched successfully", posts });
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

    const filter = {};
    if (req.user && req.user._id) {
      filter.user = req.user._id;
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {...filter ,title, content, author },
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

// Controller to delete a blog post
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

// Controller to delete all blog post of the user
exports.deleteAllPost = async (req, res) => {
  try {
    const { title } = req.body;

    // Check if the 'title' field is provided in the request body
    if (!title) {
      return res.status(400).json({ message: 'Title is required in the request body' });
    }

    const deletedResult = await Post.deleteMany({ title: title });

    if (deletedResult.deletedCount === 0) {
      return res.status(404).json({ message: 'No matching blogs found' });
    }

    res.status(200).json({ message: 'Blogs deleted successfully', deletedCount: deletedResult.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

