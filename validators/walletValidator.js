const Joi = require('joi');

// Schema for validating wallet creation
const createWalletSchema = Joi.object({
  name: Joi.string().required(), // User-defined name for the wallet
  address: Joi.string().required(), // User-provided wallet address
  network_type_id: Joi.string().required(), // UUID for network type
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