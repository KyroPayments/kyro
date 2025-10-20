const paymentService = require('../services/paymentService');
const { validatePayment } = require('../validators/paymentValidator');
const { handleAsyncError } = require('../utils/errorHandler');

// Create a new payment
const createPayment = handleAsyncError(async (req, res) => {
  const { error, value } = validatePayment(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const payment = await paymentService.createPayment(value);
  res.status(201).json({ success: true, payment });
});

// Get payment by ID
const getPayment = handleAsyncError(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  res.status(200).json({ success: true, payment });
});

// Update payment
const updatePayment = handleAsyncError(async (req, res) => {
  const payment = await paymentService.updatePayment(req.params.id, req.body);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  res.status(200).json({ success: true, payment });
});

// List payments
const listPayments = handleAsyncError(async (req, res) => {
  const { page = 1, limit = 10, status, walletId } = req.query;
  const filters = { status, walletId };
  const result = await paymentService.listPayments(page, limit, filters);
  res.status(200).json({ success: true, ...result });
});

// Cancel payment
const cancelPayment = handleAsyncError(async (req, res) => {
  const payment = await paymentService.cancelPayment(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  res.status(200).json({ success: true, payment });
});

// Confirm payment
const confirmPayment = handleAsyncError(async (req, res) => {
  const payment = await paymentService.confirmPayment(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  res.status(200).json({ success: true, payment });
});

module.exports = {
  createPayment,
  getPayment,
  updatePayment,
  listPayments,
  cancelPayment,
  confirmPayment
};