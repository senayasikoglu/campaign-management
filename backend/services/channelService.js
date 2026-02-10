const Channel = require('../models/Channel');
const channelCache = require('../utils/channelCache');

const ChannelService = {
    async createChannel(channelData) {
        try {
            const channel = new Channel(channelData);
            const saved = await channel.save();
            channelCache.invalidate();
            return saved;
        } catch (error) {
            throw error;
        }
    },

    async getAllChannels() {
        try {
            return await Channel.find();
        }   catch (error) {
            throw error;
        }
    },


    async getChannelById(channelId) {
        try {
            return await Channel.findById(channelId);
        }   catch (error) {
            throw error;
        }
    },


    async updateChannel(channelId, updateData) {
        try {
            const updated = await Channel.findByIdAndUpdate(channelId, updateData, { new: true });
            channelCache.invalidate();
            return updated;
        } catch (error) {
            throw error;
        }
    },

    async deleteChannel(channelId) {
        try {
            const result = await Channel.findByIdAndDelete(channelId);
            channelCache.invalidate();
            return result;
        } catch (error) {
            throw error;
        }
    }
};


module.exports = ChannelService; 