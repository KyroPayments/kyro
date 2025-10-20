const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Create a new transaction
router.post('/', transactionController.createTransaction);

// Get transaction by ID
router.get('/:id', transactionController.getTransaction);

// List transactions
router.get('/', transactionController.listTransactions);

// Update transaction status
router.put('/:id', transactionController.updateTransaction);

// Get transaction status
router.get('/:id/status', transactionController.getTransactionStatus);

// Refund transaction
router.post('/:id/refund', transactionController.refundTransaction);

module.exports = router;