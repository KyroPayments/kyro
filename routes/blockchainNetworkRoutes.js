const express = require('express');
const router = express.Router();
const blockchainNetworkController = require('../controllers/BlockchainNetworkController');

// GET /api/blockchain-networks - List blockchain networks
router.get('/', blockchainNetworkController.getAllBlockchainNetworks);

// GET /api/blockchain-networks/:id - Get a specific blockchain network
router.get('/:id', blockchainNetworkController.getBlockchainNetworkById);

module.exports = router;