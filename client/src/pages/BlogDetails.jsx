import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch blog data and comments
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        const [blogRes, commentsRes] = await Promise.all([
          api.get(`/blogs/${id}`),
          api.get(`/blogs/${id}/comments`),
        ]);

        setBlog(blogRes.data);
        setComments(commentsRes.data);
        setLikeCount(blogRes.data.likes ? blogRes.data.likes.length : 0);

        if (user && blogRes.data.likes) {
          setIsLiked(blogRes.data.likes.some((uId) => uId.toString() === user._id));
        }
      } catch (err) {
        setError('Blog not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id, user]);

  // Handle Like / Unlike toggle
  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      alert('Please log in to like this blog post.');
      return;
    }

    try {
      const response = await api.post(`/blogs/${id}/like`);
      setLikeCount(response.data.likesCount);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Handle Add Comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to post a comment.');
      return;
    }

    if (!newComment.trim()) return;

    setCommentSubmitting(true);
    try {
      const response = await api.post(`/blogs/${id}/comments`, { text: newComment });
      // Add new comment to top of list
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      alert('Failed to post comment. Please try again.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  // Handle Delete Blog
  const handleDeleteBlog = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/blogs/${id}`);
      alert('Blog deleted successfully.');
      navigate('/');
    } catch (err) {
      alert('Failed to delete blog.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
        Loading blog details...
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error || 'Blog not found.'}</div>
        <Link to="/" className="btn btn-outline">
          ← Back to Blog Feed
        </Link>
      </div>
    );
  }

  const categoryClass = `badge badge-${blog.category ? blog.category.toLowerCase().replace(/\s+/g, '') : 'general'}`;
  const authorId = typeof blog.author === 'object' ? blog.author._id : blog.author;
  const isAuthor = user && authorId === user._id;

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="container">
      <Link to="/" className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        ← Back to Feed
      </Link>

      {/* Main Blog Card */}
      <div className="blog-detail-card">
        <div className="blog-detail-header">
          <span className={categoryClass}>{blog.category}</span>
          <h1 className="blog-detail-title">{blog.title}</h1>

          <div className="blog-detail-meta">
            <div>
              <span>✍️ Written by <strong>{blog.authorName}</strong></span>
              <span style={{ margin: '0 0.5rem' }}>•</span>
              <span>📅 {formattedDate}</span>
            </div>

            {/* Author Controls */}
            {isAuthor && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/blog/${blog._id}/edit`} className="btn btn-outline btn-sm">
                  ✏️ Edit
                </Link>
                <button onClick={handleDeleteBlog} className="btn btn-danger btn-sm">
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Blog Content */}
        <div className="blog-detail-content">{blog.content}</div>

        {/* Interaction Bar */}
        <div className="blog-actions-bar">
          <button
            onClick={handleLikeToggle}
            className={`btn ${isLiked ? 'btn-primary' : 'btn-outline'}`}
          >
            {isLiked ? '❤️ Liked' : '🤍 Like'} ({likeCount})
          </button>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
            💬 {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </span>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3 style={{ marginBottom: '1.25rem' }}>Student Discussion & Feedback</h3>

        {/* Add Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Leave a comment as {user?.name}</label>
              <textarea
                className="form-control"
                style={{ minHeight: '90px' }}
                placeholder="Ask a question, share feedback, or contribute to this post..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={commentSubmitting}
            >
              {commentSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="alert" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
            Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>log in</Link> to join the discussion and leave a comment.
          </div>
        )}

        {/* Comments List */}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-card">
              <div className="comment-header">
                <span className="comment-author">💬 {comment.userName}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        ) : (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            No comments yet. Be the first student to comment on this blog!
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
