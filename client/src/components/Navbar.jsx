import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-brand">
          <span>🎓</span> Student Blog Hub
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Feed
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/create" className="nav-link">
                + Create Blog
              </Link>
              <Link to="/profile" className="nav-link">
                My Profile
              </Link>
              <span className="user-badge">{user?.name}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
