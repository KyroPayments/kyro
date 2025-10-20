const walletService = require('../services/walletService');
const { validateWallet } = require('../validators/walletValidator');
const { handleAsyncError } = require('../utils/errorHandler');

// Create a new wallet
const createWallet = handleAsyncError(async (req, res) => {
  const { error, value } = validateWallet(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const wallet = await walletService.createWallet(value);
  res.status(201).json({ success: true, wallet });
});

// Get wallet by ID
const getWallet = handleAsyncError(async (req, res) => {
  const wallet = await walletService.getWalletById(req.params.id);
  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found' });
  }
  res.status(200).json({ success: true, wallet });
});

// Get wallet balance
const getBalance = handleAsyncError(async (req, res) => {
  const balance = await walletService.getWalletBalance(req.params.id);
  if (!balance) {
    return res.status(404).json({ error: 'Wallet not found' });
  }
  res.status(200).json({ success: true, balance });
});

// Add funds to wallet
const depositFunds = handleAsyncError(async (req, res) => {
  const { amount, cryptoType } = req.body;
  const result = await walletService.depositFunds(req.params.id, amount, cryptoType);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json({ success: true, result });
});

// Withdraw funds from wallet
const withdrawFunds = handleAsyncError(async (req, res) => {
  const { amount, toAddress, cryptoType } = req.body;
  const result = await walletService.withdrawFunds(req.params.id, amount, toAddress, cryptoType);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json({ success: true, result });
});

// List wallets
const listWallets = handleAsyncError(async (req, res) => {
  const { page = 1, limit = 10, userId } = req.query;
  const result = await walletService.listWallets(page, limit, userId);
  res.status(200).json({ success: true, ...result });
});

// Generate new address
const generateAddress = handleAsyncError(async (req, res) => {
  const { cryptoType } = req.body;
  const address = await walletService.generateAddress(req.params.id, cryptoType);
  if (!address) {
    return res.status(404).json({ error: 'Wallet not found' });
  }
  res.status(200).json({ success: true, address });
});

module.exports = {
  createWallet,
  getWallet,
  getBalance,
  depositFunds,
  withdrawFunds,
  listWallets,
  generateAddress
};