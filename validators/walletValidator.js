const Joi = require('joi');

// Schema for validating wallet creation
const createWalletSchema = Joi.object({
  user_id: Joi.string().required(),
  crypto_type: Joi.string().valid('BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'MATIC').required(),
  balance: Joi.number().min(0),
  is_active: Joi.boolean(),
  metadata: Joi.object()
});

// Validate wallet data
const validateWallet = (data) => {
  return createWalletSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateWallet
};