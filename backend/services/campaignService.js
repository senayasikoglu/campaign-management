/**
 * Campaign Service
 * 
 * This service handles the business logic for campaign operations.
 * It provides an abstraction layer between the controller and database operations.
 * 
 * @module services/campaignService
 */

const calculateSpent = require("../utils/spentCalculator");
const Campaign = require("../models/Campaign");
const channelCache = require("../utils/channelCache");

const CampaignService = {
  /**
   * Create a new campaign in the database
   * 
   * @param {Object} campaignData - The campaign data to create
   * @returns {Promise<Object>} Created campaign document
   * @throws {Error} If validation fails or database operation fails
   */
  async createCampaign(campaignData) {
    try {
      const campaign = new Campaign(campaignData);
      return await campaign.save();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieve campaigns with pagination and optional search
   * 
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @param {string} search - Optional search term for campaign name
   * @param {string} sortField - Field to sort by (e.g., 'startDate', 'name', 'budget')
   * @param {string} sortOrder - Sort order ('asc' or 'desc')
   * @returns {Promise<Object>} Paginated results with campaign data and metadata
   * @throws {Error} If database operation fails
   */
  async getAllCampaigns(page, limit, filter, sortField = 'name', sortOrder = 'asc') {
    try {

 
      // Search by campaign name or channel name (channels: cached once on app startup, invalidated on channel CRUD operations).
      let query = {};
      if (filter && String(filter).trim()) {
        const escaped = String(filter).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');

        const allChannels = await channelCache.getChannels();
        const channelIds = allChannels.filter((c) => regex.test(c.name)).map((c) => c._id);

        query = {
          $or: [
            { name: regex },
            { channel: { $in: channelIds } },
          ],
        };
      }

      const skip = (page - 1) * limit;
      // Create sort object
      const sort = {};
      sort[sortField] = sortOrder === 'desc' ? -1 : 1;

      const [campaigns, total] = await Promise.all([
        Campaign.find(query)
          .populate('channel')
          .skip(skip)
          .limit(limit)
          .sort(sort),
        Campaign.countDocuments(query)
      ]);

      // Calculate spent for each campaign
      const campaignsWithSpent = campaigns.map(campaign => {
        const campaignObj = campaign.toObject();
        campaignObj.spent = calculateSpent(campaignObj);
        return campaignObj;
      });

      return {
        campaigns: campaignsWithSpent,
        page,
        limit,
        total
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Error fetching campaigns: ${error.message}`);
    }
  },

  /**
   * Retrieve a single campaign by its ID
   * 
   * @param {string} id - Campaign ID
   * @returns {Promise<Object>} Campaign document
   * @throws {Error} If campaign is not found or database operation fails
   */
  async getCampaignById(id) {
    try {
      const campaign = await Campaign.findById(id);
      if (!campaign) {
        const error = new Error('Campaign not found');
        error.status = 404;
        throw error;
      }

     
      return campaign;

    } catch (error) {
      if (error.name === 'CastError') {
        const error = new Error('Invalid campaign ID format');
        error.status = 400;
        throw error;
      }
      throw error;
    }
  },

  /**
   * Update an existing campaign
   * 
   * @param {string} id - Campaign ID to update
   * @param {Object} updateData - New campaign data 
   * @returns {Promise<Object>} Updated campaign document
   * @throws {Error} If campaign is not found or validation fails
   */
  async updateCampaign(id, updateData) {
    try {
      const campaign = await Campaign.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!campaign) {
        const error = new Error('Campaign not found');
        error.status = 404;
        throw error;
      }

      return campaign;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const error = new Error('Invalid update data');
        error.status = 400;
        throw error;
      }
      throw error;
    }
  },

  /**
   * Delete a campaign from the database
   * 
   * @param {string} id - Campaign ID to delete
   * @returns {Promise<void>}
   * @throws {Error} If campaign is not found or deletion fails
   */
  async deleteCampaign(id) {
    try {
      const campaign = await Campaign.findByIdAndDelete(id);
      if (!campaign) {
        const error = new Error('Campaign not found');
        error.status = 404;
        throw error;
      }
    } catch (error) {
      if (error.name === 'CastError') {
        const error = new Error('Invalid campaign ID format');
        error.status = 400;
        throw error;
      }
      throw error;
    }
  },
};

module.exports = CampaignService;
