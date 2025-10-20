const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Create a new wallet
router.post('/', walletController.createWallet);

// Get wallet by ID
router.get('/:id', walletController.getWallet);

// Get wallet balance
router.get('/:id/balance', walletController.getBalance);

// Add funds to wallet
router.post('/:id/deposit', walletController.depositFunds);

// Withdraw funds from wallet
router.post('/:id/withdraw', walletController.withdrawFunds);

// List wallets
router.get('/', walletController.listWallets);

// Generate new address
router.post('/:id/generate-address', walletController.generateAddress);

module.exports = router;