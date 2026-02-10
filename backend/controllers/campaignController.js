/**
 * Campaign Controller
 * 
 * This controller handles all campaign-related operations including CRUD operations
 * and pagination. It implements RESTful API principles and includes proper error handling.
 * 
 * @module controllers/campaignController
 */

const CampaignService = require("../services/campaignService");
const Channel = require("../models/Channel");

const Campaign = require("../models/Campaign");

const CampaignController = {

/**
 * Create a new campaign
 * 
 * @route POST /api/campaigns
 * @param {Object} req.body - Campaign data
 * @returns {Object} Created campaign object
 * @throws {400} If required fields are missing or invalid
 */
  async createCampaign(req, res) {
    try {
      const { name, channel, startDate, endDate, budget } = req.body;

      if (!name || !channel || !startDate || !endDate || !budget) {
        return res.status(400).json({ message: "All fields are required." });
      }

      if (isNaN(budget) || budget <= 0) {
        return res
          .status(400)
          .json({ message: "Budget must be a positive number." });
      }

      if (new Date(startDate) >= new Date(endDate)) {
        return res
          .status(400)
          .json({ message: "Start date must be before end date." });
      }

      // check if the provided channel exists
      const existingChannel = await Channel.findById(channel);
      if(!existingChannel){
        return res
        .status(400)
        .json({message: "The specified channel does not exist"});
      }

      //create the campaign
      const campaign = await CampaignService.createCampaign(req.body);

      const populatedCampaign = await Campaign.findById(campaign._id).populate('channel');
      if (!populatedCampaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      res.status(201).json(populatedCampaign);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Get all campaigns with pagination and filtering
   * 
   * @route GET /api/campaigns
   * @param {number} req.query.page - Page number (default: 1)
   * @param {number} req.query.limit - Items per page (default: 10)
   * @param {string} req.query.search - Optional search term
   * @param {string} req.query.sortField - Field to sort by (default: startDate)
   * @param {string} req.query.sortOrder - Sort order (asc/desc) (default: asc)
   * @returns {Object} Paginated campaigns with metadata
   * @throws {500} If there's a server error
   */
  async getAllCampaigns(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.filter || "";
      const sortField = req.query.sortField || "startDate";
      const sortOrder = req.query.sortOrder || "asc";

      // Validate sort field to prevent injection
      const allowedSortFields = ['name', 'startDate', 'endDate', 'budget', 'channel'];
      if (!allowedSortFields.includes(sortField)) {
        return res.status(400).json({ message: "Invalid sort field" });
      }

      // Validate sort order
      if (!['asc', 'desc'].includes(sortOrder)) {
        return res.status(400).json({ message: "Invalid sort order" });
      }

      const result = await CampaignService.getAllCampaigns(
        page, 
        limit, 
        search, 
        sortField, 
        sortOrder
      );
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get a specific campaign by ID
   * 
   * @route GET /api/campaigns/:id
   * @param {string} req.params.id - Campaign ID
   * @returns {Object} Campaign object
   * @throws {404} If campaign is not found
   * @throws {500} If there's a server error
   */
  async getCampaignById(req, res) {
    try {
      const campaign = await CampaignService.getCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      res.status(200).json(campaign);
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Update an existing campaign
   * 
   * @route PUT /api/campaigns/:id
   * @param {string} req.params.id - Campaign ID
   * @param {Object} req.body - Updated campaign data
   * @returns {Object} Updated campaign object
   * @throws {404} If campaign is not found
   */
  async updateCampaign(req, res) {
    try {
      const { startDate, endDate } = req.body;
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({ message: 'Start date must be before end date.' });
      }

      const campaign = await CampaignService.updateCampaign(req.params.id, req.body);
      res.status(200).json(campaign);
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Delete a campaign
   * 
   * @route DELETE /api/campaigns/:id
   * @param {string} req.params.id - Campaign ID
   * @returns {Object} Success message
   * @throws {404} If campaign is not found
   * @throws {500} If there's a server error
   */
  async deleteCampaign(req, res) {
    try {
      await CampaignService.deleteCampaign(req.params.id);
      res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = CampaignController;
