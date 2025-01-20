/**
 * Campaign Service
 * 
 * This service handles the business logic for campaign operations.
 * It provides an abstraction layer between the controller and database operations.
 * 
 * @module services/campaignService
 */

const mongoose = require("mongoose");
const calculateSpent = require("../utils/spentCalculator");
const Campaign = require("../models/Campaign");

 

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
      // Enhance error message for duplicate campaign names
      if (error.code === 11000) {
        throw new Error('Campaign name already exists');
      }
      throw error;
    }
  },

  /**
   * Retrieve campaigns with pagination and optional search
   * 
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @param {string} search - Optional search term for campaign name
   * @returns {Promise<Object>} Paginated results with campaign data and metadata
   * @throws {Error} If database operation fails
   */
  async getAllCampaigns(page, limit, search) {
    try {
      const query = search
        ? { name: { $regex: search, $options: 'i' } }
        : {};

      const skip = (page - 1) * limit;
      
      const [campaigns, total] = await Promise.all([
        Campaign.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
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
