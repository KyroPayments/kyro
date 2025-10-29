const express = require('express');
const router = express.Router();
const blockchainNetworkController = require('../controllers/BlockchainNetworkController');
const { authenticateEither } = require('../middleware/authMiddleware');

// GET /api/blockchain-networks - List blockchain networks
router.get('/', authenticateEither, blockchainNetworkController.getAllBlockchainNetworks);

// GET /api/blockchain-networks/:id - Get a specific blockchain network
router.get('/:id', blockchainNetworkController.getBlockchainNetworkById);

module.exports = router;