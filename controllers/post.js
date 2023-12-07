const Post = require('../models/post.js');

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

// Controller to get all blog posts
exports.getAllPosts = async (req, res, next) => {
  try {
    // Extract title, content, author, blogId, page, and limit from the request query
    const { title, content, author, blogId, page = 1, limit = 10 } = req.body;
    console.log(req.user.username)

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

    // Fetch posts based on the constructed filter with pagination
    const posts = await Post.find(filter, { title: 1, content: 1, author: 1, _id: 1, createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .sort({_id:-1});

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

    // Fetch posts based on the constructed filter
    const posts = await Post.find(filter, { title: 1, content: 1, author: 1, _id: 1, createdAt: 1 });

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
