const jwt = require('jsonwebtoken');

// Middleware to protect private routes using JWT
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header with Bearer exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from string "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'student_blog_hub_super_secret_key_2026');

      // Attach decoded user info to request object
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
