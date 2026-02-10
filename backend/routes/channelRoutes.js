const express = require('express');
const router = express.Router();
const ChannelController = require('../controllers/channelController');

router.post('/', ChannelController.createChannel);
router.get('/', ChannelController.getAllChannels);
router.get('/:id', ChannelController.getChannelById);
router.put('/:id', ChannelController.updateChannel);
router.delete('/:id', ChannelController.deleteChannel);


module.exports = router;