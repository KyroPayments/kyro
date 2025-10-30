const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateEither } = require('../middleware/authMiddleware');

router.post('/', authenticateEither, transactionController.createTransaction);

router.get('/:id', authenticateEither, transactionController.getTransaction);

router.get('/', authenticateEither, transactionController.listTransactions);

router.put('/:id', authenticateEither, transactionController.updateTransaction);

router.get('/:id/status', authenticateEither, transactionController.getTransactionStatus);

router.post('/:id/refund', authenticateEither, transactionController.refundTransaction);

module.exports = router;