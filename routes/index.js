const express = require('express');
const router = express.Router();

// Import route handlers
const paymentRoutes = require('./paymentRoutes');
const walletRoutes = require('./walletRoutes');
const transactionRoutes = require('./transactionRoutes');
const webhookRoutes = require('./webhookRoutes');
const authRoutes = require('./authRoutes');
const apiKeysRoutes = require('./apiKeysRoutes');
const networkTypeRoutes = require('./networkTypeRoutes');
const blockchainNetworkRoutes = require('./blockchainNetworkRoutes');
const cryptoTokenRoutes = require('./cryptoTokenRoutes');

// Authentication routes
router.use('/auth', authRoutes);

// API keys routes (nested under auth)
router.use('/auth/api-keys', apiKeysRoutes);

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

// Blockchain network routes
router.use('/blockchain-networks', blockchainNetworkRoutes);

// Crypto token routes
router.use('/crypto-tokens', cryptoTokenRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Information
 *     description: Get information about the Kyro API
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Welcome message
 *                 version:
 *                   type: string
 *                   description: API version
 */

// API info endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Kyro Crypto Payment API',
    version: '0.1.0'
  });
});

module.exports = router;