const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  getComments,
  getUserBlogs,
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllBlogs);
router.get('/user/my-blogs', protect, getUserBlogs);
router.get('/:id', getBlogById);
router.get('/:id/comments', getComments);

// Protected routes (Require login)
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);

module.exports = router;
