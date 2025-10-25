const express = require('express');
const router = express.Router();
const cryptoTokenController = require('../controllers/CryptoTokenController');

// GET /api/crypto-tokens - List crypto tokens
router.get('/', cryptoTokenController.getAllCryptoTokens);

// GET /api/crypto-tokens/:id - Get a specific crypto token
router.get('/:id', cryptoTokenController.getCryptoTokenById);

// GET /api/blockchain-networks/:networkId/tokens - Get crypto tokens for a specific blockchain network
router.get('/by-network/:networkId', cryptoTokenController.getCryptoTokensByNetwork);

module.exports = router;