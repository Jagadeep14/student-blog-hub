import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  // Format category name for CSS class (e.g. "College Life" -> "badge-collegelife")
  const categoryClass = `badge badge-${blog.category ? blog.category.toLowerCase().replace(/\s+/g, '') : 'general'}`;

  // Format date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="blog-card">
      <div>
        <div className="blog-card-top">
          <span className={categoryClass}>{blog.category}</span>
          <span className="blog-date">{formattedDate}</span>
        </div>

        <h3 className="blog-title">{blog.title}</h3>
        <p className="blog-preview">{blog.content}</p>
      </div>

      <div className="blog-card-footer">
        <div className="author-info">
          <span className="author-name">✍️ {blog.authorName}</span>
        </div>

        <div className="card-stats">
          <span>❤️ {blog.likes ? blog.likes.length : 0}</span>
          <Link to={`/blog/${blog._id}`} className="btn btn-outline btn-sm">
            Read Blog →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
