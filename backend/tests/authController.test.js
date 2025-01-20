const request = require('supertest');
const express = require('express');
const AuthController = require('../controllers/authController');
const AuthService = require('../services/authService');

// Express application setup
const app = express();
app.use(express.json());

// Routes
app.post('/auth/register', AuthController.register);
app.post('/auth/login', AuthController.login);

// Mock Service
jest.mock('../services/authService');

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validRegistration = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should register a new user successfully', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com'
        },
        token: 'mock-jwt-token'
      };

      AuthService.register.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/auth/register')
        .send(validRegistration);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(AuthService.register).toHaveBeenCalledWith(
        validRegistration.email,
        validRegistration.password
      );
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 400 if email is already registered', async () => {
      const error = new Error('Email already registered');
      error.status = 400;
      AuthService.register.mockRejectedValue(error);

      const response = await request(app)
        .post('/auth/register')
        .send(validRegistration);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already registered');
    });

    it('should handle server errors during registration', async () => {
      AuthService.register.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/auth/register')
        .send(validRegistration);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Database error');
    });
  });

  describe('login', () => {
    const validCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should login user successfully with valid credentials', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com'
        },
        token: 'mock-jwt-token'
      };

      AuthService.login.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/auth/login')
        .send(validCredentials);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(AuthService.login).toHaveBeenCalledWith(
        validCredentials.email,
        validCredentials.password
      );
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 401 for invalid credentials', async () => {
      const error = new Error('Invalid credentials');
      error.status = 401;
      AuthService.login.mockRejectedValue(error);

      const response = await request(app)
        .post('/auth/login')
        .send(validCredentials);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should handle server errors during login', async () => {
      AuthService.login.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/auth/login')
        .send(validCredentials);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Database error');
    });
  });
}); 