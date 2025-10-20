const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a new payment
router.post('/', paymentController.createPayment);

// Get payment by ID
router.get('/:id', paymentController.getPayment);

// Update payment
router.put('/:id', paymentController.updatePayment);

// List payments
router.get('/', paymentController.listPayments);

// Cancel payment
router.delete('/:id', paymentController.cancelPayment);

// Process payment confirmation
router.post('/:id/confirm', paymentController.confirmPayment);

module.exports = router;