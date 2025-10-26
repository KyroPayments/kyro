const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateEither } = require('../middleware/authMiddleware');

// Create a new payment
router.post('/', authenticateEither, paymentController.createPayment);

// Get payment by ID (authenticated users only)
router.get('/:id', authenticateEither, paymentController.getPayment);

// Get payment by ID for public payment page (no authentication required)
router.get('/public/:id', paymentController.getPaymentPublic);

// Confirm payment (public endpoint for payment completion)
router.post('/public/:id/confirm', paymentController.confirmPaymentPublic);

// Update payment
router.put('/:id', authenticateEither, paymentController.updatePayment);

// List payments
router.get('/', authenticateEither, paymentController.listPayments);

// Cancel payment
router.delete('/:id', authenticateEither, paymentController.cancelPayment);

// Process payment confirmation
router.post('/:id/confirm', authenticateEither, paymentController.confirmPayment);

module.exports = router;