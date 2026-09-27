import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogDetails from './pages/BlogDetails';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create" element={<CreateBlog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/blog/:id/edit" element={<EditBlog />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>
              <strong>Student Blog Hub</strong> &copy; {new Date().getFullYear()} – A MERN Stack College Mini Project
            </p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: '#94a3b8' }}>
              Built with MongoDB, Express.js, React.js, and Node.js for Academic Knowledge Sharing
            </p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
