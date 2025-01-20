/**
 * Authentication Service
 * 
 * This service handles all authentication-related business logic including
 * 
 * @module services/authService
 */

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const AuthService = {
  /**
   * Register a new user
   * 
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user document (without password)
   * @throws {Error} If email already exists or validation fails
   */
  async register(email, password) {
    try {
  
    
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        const error = new Error('Email already registered');
        error.status = 400;
        throw error;
      }
      const passwordStr = String(password).trim();

      // Generate hash with fixed salt for testing
      const SALT_ROUNDS = 10;
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const hashedPassword = bcrypt.hashSync(passwordStr, salt);
 
      // Create and save user
      const user = new User({
        email,
        password: hashedPassword
      });

      const savedUser = await user.save();
 

      // Generate token
      const token = jwt.sign(
        { id: savedUser._id, email: savedUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        user: {
          id: savedUser._id,
          email: savedUser.email
        },
        token
      };

    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Authenticate user and generate JWT token
   * 
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} Object containing user data and JWT token
   * @throws {Error} If credentials are invalid or user not found
   */
  async login(email, password) {
    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Convert password to string and trim
      const passwordStr = String(password).trim();

      console.log('Login attempt:', {
        email,
        passwordLength: passwordStr.length
      });

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }
 

      // Compare passwords using compareSync
      const isMatch = bcrypt.compareSync(passwordStr, user.password);
 

      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Generate token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        user: {
          id: user._id,
          email: user.email
        },
        token
      };

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Verify JWT token and return decoded user data
   * 
   * @param {string} token - JWT token to verify
   * @returns {Promise<Object>} Decoded user data from token
   * @throws {Error} If token is invalid or expired
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      error = new Error('Invalid or expired token');
      error.status = 401;
      throw error;
    }
  },

 
 
};

module.exports = AuthService; 