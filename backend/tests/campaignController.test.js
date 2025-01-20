const request = require('supertest');
const express = require('express');
const CampaignController = require('../controllers/campaignController');
const CampaignService = require('../services/campaignService');
const authMiddleware = require('../middleware/middleware.auth');

// Mock Auth Middleware
jest.mock('../middleware/middleware.auth', () => {
  return jest.fn((req, res, next) => {
    // Add mock user for testing
    req.user = {
      id: 'test-user-id',
      email: 'test@example.com'
    };
    next();
  });
});

// Express application and middleware setup
const app = express();
app.use(express.json());

// Add auth middleware to all routes
app.use(authMiddleware);

// Routes
app.post('/campaigns', CampaignController.createCampaign);
app.get('/campaigns', CampaignController.getAllCampaigns);
app.get('/campaigns/:id', CampaignController.getCampaignById);
app.put('/campaigns/:id', CampaignController.updateCampaign);
app.delete('/campaigns/:id', CampaignController.deleteCampaign);

// Mock Service
jest.mock('../services/campaignService');

describe('CampaignController', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should return 401 if no token provided', async () => {
      // Temporarily override auth middleware to return unauthorized
      authMiddleware.mockImplementationOnce((req, res, next) => {
        return res.status(401).json({ message: 'No token provided' });
      });

      const response = await request(app).get('/campaigns');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('No token provided');
    });

    it('should return 403 if user role is not authorized', async () => {
      // Temporarily override auth middleware to return forbidden
      authMiddleware.mockImplementationOnce((req, res, next) => {
        return res.status(403).json({ message: 'Not authorized' });
      });

      const response = await request(app).post('/campaigns');
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Not authorized');
    });
  });

  describe('createCampaign', () => {
    it('should create a new campaign when valid data is provided', async () => {
      const campaignData = {
        name: 'Test Campaign',
        channel: 'SOCIAL_MEDIA',
        startDate: '2024-06-01T00:00:00Z',
        endDate: '2024-08-31T00:00:00Z',
        budget: 1000
      };

      const mockCampaign = {
        ...campaignData,
        id: '123',
      };

      CampaignService.createCampaign.mockResolvedValue(mockCampaign);

      const response = await request(app)
        .post('/campaigns')
        .send(campaignData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCampaign);
      expect(CampaignService.createCampaign).toHaveBeenCalledWith({
        ...campaignData
      });
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/campaigns')
        .send({
          channel: 'SOCIAL_MEDIA',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required.');
    });

    it('should return 400 if startDate is after endDate', async () => {
      const response = await request(app)
        .post('/campaigns')
        .send({
          name: 'Invalid Campaign',
          channel: 'SOCIAL_MEDIA',
          startDate: '2024-08-31T00:00:00Z',
          endDate: '2024-06-01T00:00:00Z',
          budget: 1000,
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Start date must be before end date.');
    });
  });


  describe('getAllCampaigns', () => {
    it('should return all campaigns ', async () => {
      const mockCampaigns = {
        campaigns: [
          {
            id: '1',
            name: 'Campaign 1',
            channel: 'EMAIL',
            startDate: '2024-06-01T00:00:00Z',
            endDate: '2024-08-31T00:00:00Z',
            budget: 500
          },
          {
            id: '2',
            name: 'Campaign 2',
            channel: 'SOCIAL_MEDIA',
            startDate: '2024-03-01T00:00:00Z',
            endDate: '2024-05-31T00:00:00Z',
            budget: 1000
          }
        ],
        page: 1,
        limit: 10,
        total: 2
      };

      CampaignService.getAllCampaigns.mockResolvedValue(mockCampaigns);

      const response = await request(app).get('/campaigns');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCampaigns);
      expect(CampaignService.getAllCampaigns).toHaveBeenCalledWith(1, 10, "");
    });
  });

  describe('getAllCampaignsWithPagination', () => {
    it('should return paginated campaigns', async () => {
      const mockCampaigns = [
        {
          id: '1',
          name: 'Campaign 1',
          channel: 'SOCIAL_MEDIA',
          startDate: '2024-06-01T00:00:00Z',
          endDate: '2024-08-31T00:00:00Z',
          budget: 500
        },
        {
          id: '2',
          name: 'Campaign 2',
          channel: 'EMAIL',
          startDate: '2024-03-01T00:00:00Z',
          endDate: '2024-05-31T00:00:00Z',
          budget: 1000
        },
      ];

      const mockPaginatedResponse = {
        campaigns: mockCampaigns,
        page: 1,
        limit: 10,
        total: 2
      };

      CampaignService.getAllCampaigns.mockResolvedValue(mockPaginatedResponse);

      const response = await request(app)
        .get('/campaigns')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPaginatedResponse);
    });

    it('should use default pagination values if not provided', async () => {
      const mockPaginatedResponse = {
        campaigns: [],
        page: 1,
        limit: 10,
        total: 0
      };

      CampaignService.getAllCampaigns.mockResolvedValue(mockPaginatedResponse);

      const response = await request(app).get('/campaigns');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPaginatedResponse);
      expect(CampaignService.getAllCampaigns).toHaveBeenCalledWith(1, 10, "");
    });
  });

  describe('getCampaignById', () => {
    it('should return a campaign if found', async () => {
      const mockCampaign = {
        id: '1',
        name: 'Campaign 1',
        channel: 'EMAIL',
        startDate: '2024-06-01T00:00:00Z',
        endDate: '2024-08-31T00:00:00Z',
        budget: 500
      };

      CampaignService.getCampaignById.mockResolvedValue(mockCampaign);

      const response = await request(app).get('/campaigns/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCampaign);
      expect(CampaignService.getCampaignById).toHaveBeenCalledWith('1');
    });

    it('should return 404 if campaign not found', async () => {
      const error = new Error('NOT_FOUND');
      error.status = 404;
      CampaignService.getCampaignById.mockRejectedValue(error);

      const response = await request(app).get('/campaigns/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('NOT_FOUND');

      
    });

    describe('updateCampaign', () => {
      const updateData = {
        name: 'Updated Campaign',
        budget: 2000
      };

      it('should update a campaign successfully', async () => {
        const updatedCampaign = { id: '1', ...updateData };
        CampaignService.updateCampaign.mockResolvedValue(updatedCampaign);

        const response = await request(app)
          .put('/campaigns/1')
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedCampaign);
      });

      it('should return 400 if dates are invalid', async () => {
        const response = await request(app)
          .put('/campaigns/1')
          .send({
            startDate: '2024-08-31T00:00:00Z',
            endDate: '2024-06-01T00:00:00Z'
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Start date must be before end date.');
      });

      it('should return 404 if campaign not found', async () => {
        const error = new Error('Campaign not found');
        error.status = 404;
        CampaignService.updateCampaign.mockRejectedValue(error);

        const response = await request(app)
          .put('/campaigns/999')
          .send(updateData);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Campaign not found');
      });
    });

    describe('deleteCampaign', () => {
      it('should delete a campaign successfully', async () => {
        CampaignService.deleteCampaign.mockResolvedValue();

        const response = await request(app).delete('/campaigns/1');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Campaign deleted successfully');
      });

      it('should return 404 if campaign not found', async () => {
        const error = new Error('Campaign not found');
        error.status = 404;
        CampaignService.deleteCampaign.mockRejectedValue(error);

        const response = await request(app).delete('/campaigns/999');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Campaign not found');
      });

      it('should handle server errors', async () => {
        CampaignService.deleteCampaign.mockRejectedValue(new Error('Database error'));

        const response = await request(app).delete('/campaigns/1');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database error');
      });

      it('should handle server errors', async () => {
        CampaignService.getCampaignById.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/campaigns/1');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database error');
      });
    });

  
  });
});

