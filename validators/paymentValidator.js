const Joi = require('joi');

// Schema for validating payment creation
const createPaymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().valid('BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'MATIC').required(),
  wallet_id: Joi.string().required(),
  merchant_id: Joi.string().required(),
  description: Joi.string().max(500),
  metadata: Joi.object(),
  callback_url: Joi.string().uri(),
  expires_at: Joi.date()
});

// Validate payment data
const validatePayment = (data) => {
  return createPaymentSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validatePayment
};