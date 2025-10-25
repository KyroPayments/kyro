const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticateEither } = require('../middleware/authMiddleware');

// Create a new wallet
router.post('/', authenticateEither, walletController.createWallet);

// Get wallet by ID
router.get('/:id', authenticateEither, walletController.getWallet);

// Get wallet balance
router.get('/:id/balance', authenticateEither, walletController.getBalance);

// Add funds to wallet
router.post('/:id/deposit', authenticateEither, walletController.depositFunds);

// Withdraw funds from wallet
router.post('/:id/withdraw', authenticateEither, walletController.withdrawFunds);

// List wallets
router.get('/', authenticateEither, walletController.listWallets);



module.exports = router;