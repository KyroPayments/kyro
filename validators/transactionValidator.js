const Joi = require('joi');

// Schema for validating transaction creation
const createTransactionSchema = Joi.object({
  from_wallet: Joi.string().required(),
  to_wallet: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().valid('BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'MATIC').required(),
  type: Joi.string().valid('transfer', 'payment', 'refund').default('transfer'),
  fee: Joi.number().min(0),
  metadata: Joi.object()
});

// Validate transaction data
const validateTransaction = (data) => {
  return createTransactionSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateTransaction
};