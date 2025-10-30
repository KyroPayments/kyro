const Joi = require('joi');

// Schema for validating payment creation
const createPaymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  crypto_token_id: Joi.string().required(), // Reference to crypto token instead of currency text
  description: Joi.string().max(500).required(), // Description is now required
  wallet_id: Joi.string().required(), // User must select their wallet
  merchant_id: Joi.string().required(),
  metadata: Joi.object(),
  callback_url: Joi.string().uri().allow(null, '').optional(),
  cancel_url: Joi.string().uri().allow(null, '').optional(),
  expires_at: Joi.date().required() // Expiration date is now required
});

// Validate payment data
const validatePayment = (data) => {
  return createPaymentSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validatePayment
};