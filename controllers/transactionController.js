const transactionService = require('../services/transactionService');
const { validateTransaction } = require('../validators/transactionValidator');
const { handleAsyncError } = require('../utils/errorHandler');

// Create a new transaction
const createTransaction = handleAsyncError(async (req, res) => {
  const { error, value } = validateTransaction(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const transaction = await transactionService.createTransaction(value, req.userId, req.userWorkspace);
  res.status(201).json({ success: true, transaction });
});

// Get transaction by ID
const getTransaction = handleAsyncError(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.params.id);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  // Verify that the authenticated user owns this transaction
  if (transaction.user_id !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized: You do not own this transaction' });
  }
  
  res.status(200).json({ success: true, transaction });
});

// List transactions
const listTransactions = handleAsyncError(async (req, res) => {
  const { page = 1, limit = 10, status, walletId, paymentId, type } = req.query;
  const filters = { status, walletId, paymentId, type };
  const result = await transactionService.listTransactions(page, limit, filters, req.userWorkspace, req.userId);
  res.status(200).json({ success: true, ...result });
});

// Update transaction
const updateTransaction = handleAsyncError(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.params.id);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  // Verify that the authenticated user owns this transaction
  if (transaction.user_id !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized: You do not own this transaction' });
  }
  
  const updatedTransaction = await transactionService.updateTransaction(req.params.id, req.body);
  res.status(200).json({ success: true, transaction: updatedTransaction });
});

// Get transaction status
const getTransactionStatus = handleAsyncError(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.params.id);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  // Verify that the authenticated user owns this transaction
  if (transaction.user_id !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized: You do not own this transaction' });
  }
  
  const status = await transactionService.getTransactionStatus(req.params.id);
  if (!status) {
    return res.status(404).json({ error: 'Transaction status not found' });
  }
  res.status(200).json({ success: true, status });
});

// Refund transaction
const refundTransaction = handleAsyncError(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.params.id);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  // Verify that the authenticated user owns this transaction
  if (transaction.user_id !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized: You do not own this transaction' });
  }
  
  const refundedTransaction = await transactionService.refundTransaction(req.params.id);
  res.status(200).json({ success: true, transaction: refundedTransaction });
});

module.exports = {
  createTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
  getTransactionStatus,
  refundTransaction
};