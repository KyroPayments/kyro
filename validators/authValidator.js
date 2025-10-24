const Joi = require('joi');

// User registration validation
const userRegistrationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

// User login validation
const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// API key creation validation
const apiKeySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  permissions: Joi.array().items(Joi.string().valid('read', 'write', 'admin')).default(['read', 'write'])
});

const validateUserRegistration = (data) => {
  return userRegistrationSchema.validate(data);
};

const validateUserLogin = (data) => {
  return userLoginSchema.validate(data);
};

const validateApiKey = (data) => {
  return apiKeySchema.validate(data);
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateApiKey
};