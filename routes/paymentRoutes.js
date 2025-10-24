const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateEither } = require('../middleware/authMiddleware');

// Create a new payment
router.post('/', authenticateEither, paymentController.createPayment);

// Get payment by ID
router.get('/:id', authenticateEither, paymentController.getPayment);

// Update payment
router.put('/:id', authenticateEither, paymentController.updatePayment);

// List payments
router.get('/', authenticateEither, paymentController.listPayments);

// Cancel payment
router.delete('/:id', authenticateEither, paymentController.cancelPayment);

// Process payment confirmation
router.post('/:id/confirm', authenticateEither, paymentController.confirmPayment);

module.exports = router;