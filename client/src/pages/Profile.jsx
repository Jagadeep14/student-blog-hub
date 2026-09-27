import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchMyBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/blogs/user/my-blogs');
        setMyBlogs(res.data);
      } catch (err) {
        console.error('Error fetching user blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [isAuthenticated, navigate]);

  const handleDelete = async (blogId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/blogs/${blogId}`);
      setMyBlogs(myBlogs.filter((b) => b._id !== blogId));
      alert('Blog deleted successfully.');
    } catch (err) {
      alert('Failed to delete blog.');
    }
  };

  if (!user) return null;

  // Get student initials for avatar
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'ST';

  return (
    <div className="container">
      {/* Student Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar">{initials}</div>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>{user.name}</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
            📧 {user.email}
          </p>
          <p style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}>
            🏛️ Department: {user.department || 'Computer Science & Engineering'}
          </p>
        </div>
      </div>

      {/* Student's Blogs Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>My Published Blogs ({myBlogs.length})</h3>
        <Link to="/create" className="btn btn-primary btn-sm">
          + Create New Blog
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b' }}>
          Loading your blogs...
        </div>
      ) : myBlogs.length > 0 ? (
        <div className="blog-grid">
          {myBlogs.map((blog) => {
            const categoryClass = `badge badge-${blog.category ? blog.category.toLowerCase().replace(/\s+/g, '') : 'general'}`;
            return (
              <div key={blog._id} className="blog-card">
                <div>
                  <div className="blog-card-top">
                    <span className={categoryClass}>{blog.category}</span>
                    <span className="blog-date">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-preview">{blog.content}</p>
                </div>

                <div className="blog-card-footer">
                  <span>❤️ {blog.likes ? blog.likes.length : 0} likes</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/blog/${blog._id}`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                    <Link to={`/blog/${blog._id}/edit`} className="btn btn-outline btn-sm">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">✍️</div>
          <h3>You haven't written any blogs yet!</h3>
          <p style={{ marginBottom: '1.5rem' }}>Share your first tutorial, project experience, or exam notes.</p>
          <Link to="/create" className="btn btn-primary">
            Write Your First Blog
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
