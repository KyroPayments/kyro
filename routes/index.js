const express = require('express');
const router = express.Router();

// Import route handlers
const paymentRoutes = require('./paymentRoutes');
const walletRoutes = require('./walletRoutes');
const transactionRoutes = require('./transactionRoutes');
const webhookRoutes = require('./webhookRoutes');
const authRoutes = require('./authRoutes');
const networkTypeRoutes = require('./networkTypeRoutes');

// Authentication routes
router.use('/auth', authRoutes);

// Payment routes
router.use('/payments', paymentRoutes);

// Wallet routes
router.use('/wallets', walletRoutes);

// Transaction routes
router.use('/transactions', transactionRoutes);

// Webhook routes
router.use('/webhooks', webhookRoutes);

// Network type routes
router.use('/network-types', networkTypeRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Kyro Crypto Payment API',
    version: '0.1.0',
    supported_networks: require('../config').cryptoNetworks.supported
  });
});

module.exports = router;