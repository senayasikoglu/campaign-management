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

// Generic login error message to avoid leaking whether email exists or password is wrong
const errorMessage = 'Invalid credentials, please check your email or password';
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
      // Let controller decide how to log and format the error response
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
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error(errorMessage);
        error.status = 401;
        throw error;
      }

      // Convert password to string and trim
      const passwordStr = String(password).trim();

      // Compare passwords
      const isMatch = bcrypt.compareSync(passwordStr, user.password);
      if (!isMatch) {
        const error = new Error(errorMessage);
        error.status = 401;
        throw error;
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
      console.error('Catched error in login service:', error);
      throw error;
    }
  },
 

 
 
};

module.exports = AuthService; 