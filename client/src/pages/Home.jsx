import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BlogCard from '../components/BlogCard';

const CATEGORIES = ['All', 'Technology', 'Education', 'Projects', 'College Life', 'General'];

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch blogs whenever category or search term changes
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Build query string
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        if (searchTerm.trim() !== '') {
          params.append('search', searchTerm.trim());
        }

        const response = await api.get(`/blogs?${params.toString()}`);
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search by 300ms for smooth typing
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm]);

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Student Blog Hub</h1>
        <p className="hero-subtitle">
          A collaborative blogging platform for college students to share academic insights, campus projects, and tech tutorials.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search blogs by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="categories-container">
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Filter by:</span>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Feed */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
          Loading student blogs...
        </div>
      ) : blogs.length > 0 ? (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No blogs found</h3>
          <p>Try searching for a different keyword or selecting another category.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
