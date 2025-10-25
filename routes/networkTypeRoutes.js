const express = require('express');
const router = express.Router();
const networkTypeController = require('../controllers/networkTypeController');

// GET /api/network-types - List network types
router.get('/', networkTypeController.getAllNetworkTypes);

// GET /api/network-types/:id - Get a specific network type
router.get('/:id', networkTypeController.getNetworkTypeById);

module.exports = router;