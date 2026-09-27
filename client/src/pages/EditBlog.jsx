import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Technology', 'Education', 'Projects', 'College Life', 'General'];

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    content: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        const blog = response.data;

        // Ensure only the author can edit
        const authorId = typeof blog.author === 'object' ? blog.author._id : blog.author;
        if (authorId !== user?._id) {
          setError('Unauthorized: You can only edit blogs you authored.');
          return;
        }

        setFormData({
          title: blog.title,
          category: blog.category,
          content: blog.content,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching blog details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.put(`/blogs/${id}`, formData);
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating blog post.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
        Loading blog for editing...
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-box">
        <h2 className="form-title">Edit Blog</h2>
        <p className="form-subtitle">Update your blog's title, category, or content.</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Blog Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Blog Content *</label>
            <textarea
              name="content"
              className="form-control"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate(`/blog/${id}`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
