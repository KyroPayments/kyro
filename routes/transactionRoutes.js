const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateEither } = require('../middleware/authMiddleware');

// Create a new transaction
router.post('/', authenticateEither, transactionController.createTransaction);

// Get transaction by ID
router.get('/:id', authenticateEither, transactionController.getTransaction);

// List transactions
router.get('/', authenticateEither, transactionController.listTransactions);

// Update transaction status
router.put('/:id', authenticateEither, transactionController.updateTransaction);

// Get transaction status
router.get('/:id/status', authenticateEither, transactionController.getTransactionStatus);

// Refund transaction
router.post('/:id/refund', authenticateEither, transactionController.refundTransaction);

module.exports = router;