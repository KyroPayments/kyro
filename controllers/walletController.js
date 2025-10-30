const walletService = require('../services/walletService');
const { validateWallet } = require('../validators/walletValidator');
const { handleAsyncError } = require('../utils/errorHandler');

// Create a new wallet
const createWallet = handleAsyncError(async (req, res) => {
  const { error, value } = validateWallet(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const walletData = { ...value };
  const wallet = await walletService.createWallet(walletData, req.userId);
  res.status(201).json({ success: true, wallet });
});

// Get wallet by ID
const getWallet = handleAsyncError(async (req, res) => {
  const wallet = await walletService.getWalletById(req.params.id, req.userId);
  if (!wallet) {
    return res.status(404).json({ error: 'Wallet not found or does not belong to user' });
  }
  res.status(200).json({ success: true, wallet });
});

// Get wallet balance
const getBalance = handleAsyncError(async (req, res) => {
  const balance = await walletService.getWalletBalance(req.params.id, req.userId);
  if (!balance) {
    return res.status(404).json({ error: 'Wallet not found or does not belong to user' });
  }
  res.status(200).json({ success: true, balance });
});

// Get wallet balance details (based on confirmed payments)
const getBalanceDetails = handleAsyncError(async (req, res) => {
  const balanceDetails = await walletService.getWalletBalanceDetails(req.params.id, req.userId);
  if (!balanceDetails) {
    return res.status(404).json({ error: 'Wallet not found or does not belong to user' });
  }
  res.status(200).json({ success: true, ...balanceDetails });
});

// Add funds to wallet
const depositFunds = handleAsyncError(async (req, res) => {
  const { amount, network_type } = req.body;
  const result = await walletService.depositFunds(req.params.id, amount, network_type, req.userId);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json({ success: true, result });
});

// Withdraw funds from wallet
const withdrawFunds = handleAsyncError(async (req, res) => {
  const { amount, toAddress, network_type } = req.body;
  const result = await walletService.withdrawFunds(req.params.id, amount, toAddress, network_type, req.userId);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json({ success: true, result });
});

// List wallets
const listWallets = handleAsyncError(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  // Always use the authenticated user's ID, ignore any userId from query params for security
  const result = await walletService.listWallets(page, limit, req.userId);
  res.status(200).json({ success: true, ...result });
});



module.exports = {
  createWallet,
  getWallet,
  getBalance,
  getBalanceDetails,
  depositFunds,
  withdrawFunds,
  listWallets
};