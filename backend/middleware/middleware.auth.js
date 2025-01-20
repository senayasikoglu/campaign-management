/**
 * Authentication Middleware
 * Checks if user is logged in by validating JWT token
 */

const jwt = require('jsonwebtoken');


//checking Auth header for JWT token
const auth = async (req, res, next) => {
  try {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error("AUTHENTICATION_REQUIRED");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = auth; 