const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

// @desc    Get all blogs (supports category filter and title search)
// @route   GET /api/blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filter by category if specified and not 'All'
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search by title (case-insensitive)
    if (search && search.trim() !== '') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    // Retrieve blogs, newest first
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog details', error: error.message });
  }
};

// @desc    Create a new blog post
// @route   POST /api/blogs
exports.createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const blog = await Blog.create({
      title,
      content,
      category: category || 'General',
      author: req.user.id,
      authorName: req.user.name,
      likes: [],
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};

// @desc    Update own blog post
// @route   PUT /api/blogs/:id
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Security check: Only author can update their own blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only edit your own blogs' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
};

// @desc    Delete own blog post and its comments
// @route   DELETE /api/blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Security check: Only author can delete their own blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own blogs' });
    }

    // Delete associated comments
    await Comment.deleteMany({ blog: blog._id });

    // Delete the blog
    await blog.deleteOne();

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
};

// @desc    Toggle like / unlike a blog
// @route   POST /api/blogs/:id/like
exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const userId = req.user.id;
    const isLiked = blog.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      // Unlike: remove user ID
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like: add user ID
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({
      message: isLiked ? 'Blog unliked' : 'Blog liked',
      likesCount: blog.likes.length,
      likes: blog.likes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

// @desc    Add a comment to a blog
// @route   POST /api/blogs/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text cannot be empty' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const comment = await Comment.create({
      blog: blog._id,
      user: req.user.id,
      userName: req.user.name,
      text: text.trim(),
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

// @desc    Get comments for a blog
// @route   GET /api/blogs/:id/comments
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

// @desc    Get blogs created by logged-in user
// @route   GET /api/blogs/user/my-blogs
exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your blogs', error: error.message });
  }
};
