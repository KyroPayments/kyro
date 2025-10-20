const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Handle wallet webhook
router.post('/wallet', webhookController.handleWalletWebhook);

// Handle transaction webhook
router.post('/transaction', webhookController.handleTransactionWebhook);

// Handle payment webhook
router.post('/payment', webhookController.handlePaymentWebhook);

// Verify webhook signature
router.post('/verify', webhookController.verifyWebhook);

module.exports = router;