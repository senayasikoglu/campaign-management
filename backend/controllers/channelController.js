const ChannelService = require('../services/channelService');

const ChannelController = {

    async createChannel(req, res){
        try {
            const { name, status } = req.body;


            if(!name || !status){
                return res.status(400).json({message: "Name and status are required"});
            }

            if( !['active', 'passive'].includes(status)){
                return res.status(400).json({message: "Invalid  status value"});
            }


            const channel = await ChannelService.createChannel(req.body);
            res.status(201).json(channel);
        }   catch (error) { 
            res.status(500).json({message: error.message});
        }
    },


    async getAllChannels(req, res){
        try {
            const channels = await ChannelService.getAllChannels();
            res.status(200).json(channels);
        } catch (error) {
                res.status(500).json({message: error.message});
            }
        },

    
    async getChannelById(req, res){
        try {
            const { id } = req.params;
            const channel = await ChannelService.getChannelById(id);


            if(!channel){
                return res.status(404).json({message: "Channel not found"})
            }


            res.status(200).json(channel);
        }  catch (error) {
            res.status(500).json({message: error.message});
        }
    },


    async updateChannel(req, res){
        try {
            const { id } = req.params;
            const updateData = req.body;

            const updatedChannel = await ChannelService.updateChannel(id, updateData);

            if(!updatedChannel){
                return res.status(404).json({message: "Channel not found"});
            }

            res.status(200).json(updatedChannel);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },


    async deleteChannel(req, res){
        try {
            const { id } = req.params;
            const deletedChannel = await ChannelService.deleteChannel(id);

            if(!deletedChannel){
                return res.status(404).json({message: "Channel not found"})
            }

            res.status(200).json({message: "Channel deleted successfully"});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

 };

 module.exports = ChannelController;


