const webhookService = require('../services/webhookService');
const { verifyWebhookSignature } = require('../utils/webhookUtils');
const { handleAsyncError } = require('../utils/errorHandler');

// Handle wallet webhook
const handleWalletWebhook = handleAsyncError(async (req, res) => {
  const isValid = verifyWebhookSignature(req);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const result = await webhookService.handleWalletWebhook(req.body);
  res.status(200).json({ success: true, processed: result });
});

// Handle transaction webhook
const handleTransactionWebhook = handleAsyncError(async (req, res) => {
  const isValid = verifyWebhookSignature(req);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const result = await webhookService.handleTransactionWebhook(req.body);
  res.status(200).json({ success: true, processed: result });
});

// Handle payment webhook
const handlePaymentWebhook = handleAsyncError(async (req, res) => {
  const isValid = verifyWebhookSignature(req);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }

  const result = await webhookService.handlePaymentWebhook(req.body);
  res.status(200).json({ success: true, processed: result });
});

// Verify webhook
const verifyWebhook = handleAsyncError(async (req, res) => {
  const isValid = verifyWebhookSignature(req);
  res.status(200).json({ success: isValid });
});

module.exports = {
  handleWalletWebhook,
  handleTransactionWebhook,
  handlePaymentWebhook,
  verifyWebhook
};