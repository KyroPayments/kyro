const transactionService = require('../services/transactionService');
const { validateTransaction } = require('../validators/transactionValidator');
const { handleAsyncError } = require('../utils/errorHandler');

// Create a new transaction
const createTransaction = handleAsyncError(async (req, res) => {
  const { error, value } = validateTransaction(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const transaction = await transactionService.createTransaction(value);
  res.status(201).json({ success: true, transaction });
});

// Get transaction by ID
const getTransaction = handleAsyncError(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.params.id);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.status(200).json({ success: true, transaction });
});

// List transactions
const listTransactions = handleAsyncError(async (req, res) => {
  const { page = 1, limit = 10, status, walletId, type } = req.query;
  const filters = { status, walletId, type };
  const result = await transactionService.listTransactions(page, limit, filters);
  res.status(200).json({ success: true, ...result });
});

// Update transaction
const updateTransaction = handleAsyncError(async (req, res) => {
  const transaction = await transactionService.updateTransaction(req.params.id, req.body);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.status(200).json({ success: true, transaction });
});

// Get transaction status
const getTransactionStatus = handleAsyncError(async (req, res) => {
  const status = await transactionService.getTransactionStatus(req.params.id);
  if (!status) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.status(200).json({ success: true, status });
});

// Refund transaction
const refundTransaction = handleAsyncError(async (req, res) => {
  const transaction = await transactionService.refundTransaction(req.params.id);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.status(200).json({ success: true, transaction });
});

module.exports = {
  createTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
  getTransactionStatus,
  refundTransaction
};