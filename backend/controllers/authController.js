/**
 * Authentication Controller
 * 
 * This controller handles user authentication operations like registration,
 * login
 * 
 * @module controllers/authController
 */

const AuthService = require('../services/authService');

const AuthController = {
  /**
   * Register a new user
   * 
   * @route POST /api/auth/register
   * @param {Object} req.body - Registration data
   * @returns {Object} User data and JWT token
   * @throws {400} If email is already registered or data is invalid
   */
  async register(req, res) {
    try {
      const { email, password } = req.body;

      // Basic validation
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required'
        });
      }

      // Register user using AuthService
      const result = await AuthService.register(email, password);
      res.status(201).json(result);

    } catch (error) {
      console.error('Registration error:', error);
      res.status(error.status || 400).json({
        message: error.message || 'Error during registration'
      });
    }
  },

  /**
   * Login user
   * 
   * This endpoint authenticates a user and returns a JWT token.
   * 
   * @route POST /api/auth/login
   * @param {Object} req.body - Login credentials
   * @returns {Object} User data and JWT token
   * @throws {401} If credentials are invalid
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Basic validation
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required'
        });
      }

      // Authenticate user using AuthService
      const result = await AuthService.login(email, password);
      res.status(200).json(result);

    } catch (error) {
      console.error('Login error:', error);
      res.status(error.status || 401).json({
        message: error.message || 'Invalid credentials'
      });
    }
  },
};

module.exports = AuthController;