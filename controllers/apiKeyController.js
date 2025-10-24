const ApiKey = require('../models/ApiKey');
const User = require('../models/User');
const { validateApiKey } = require('../validators/authValidator');
const { handleAsyncError } = require('../utils/errorHandler');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate API key
const generateApiKey = () => {
  // Create a random identifier prefix and secret
  const prefix = crypto.randomBytes(8).toString('hex'); // 16 char prefix
  const secret = crypto.randomBytes(32).toString('hex'); // 64 char secret
  return `${prefix}_${secret}`;
};

// Hash API key for storage
const hashApiKey = async (apiKey) => {
  return await bcrypt.hash(apiKey, 10);
};

// Create a new API key
const createApiKey = handleAsyncError(async (req, res) => {
  const { error, value } = validateApiKey(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, permissions } = value;
  const userId = req.userId;

  // Validate that user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Generate new API key
  const apiKey = generateApiKey();
  const keyHash = await hashApiKey(apiKey);

  // Create API key in database
  const newApiKey = await ApiKey.create({
    user_id: userId,
    name,
    key_hash: keyHash,
    permissions
  });

  // Return the key to the user (only when first created)
  res.status(201).json({
    success: true,
    apiKey: `${newApiKey.id}_${apiKey}`, // Combine ID and key for easier use
    keyInfo: newApiKey
  });
});

// Get all API keys for user
const getApiKeys = handleAsyncError(async (req, res) => {
  const userId = req.userId;

  // Get API keys from database
  const apiKeys = await ApiKey.findByUserId(userId);

  res.status(200).json({
    success: true,
    apiKeys
  });
});

// Delete/revoke an API key
const deleteApiKey = handleAsyncError(async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  // Get the API key to make sure it belongs to the user
  const apiKey = await ApiKey.findById(id);
  if (!apiKey) {
    return res.status(404).json({ error: 'API key not found' });
  }

  if (apiKey.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // Delete the API key
  await ApiKey.delete(id);

  res.status(200).json({
    success: true,
    message: 'API key revoked successfully'
  });
});

// Update API key
const updateApiKey = handleAsyncError(async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;
  const userId = req.userId;

  // Get the API key to make sure it belongs to the user
  const apiKey = await ApiKey.findById(id);
  if (!apiKey) {
    return res.status(404).json({ error: 'API key not found' });
  }

  if (apiKey.user_id !== userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // Prepare update data
  const updateData = {};
  if (name) updateData.name = name;
  if (permissions) updateData.permissions = permissions;

  // Update the API key
  const updatedApiKey = await ApiKey.update(id, updateData);

  res.status(200).json({
    success: true,
    keyInfo: updatedApiKey
  });
});

module.exports = {
  createApiKey,
  getApiKeys,
  deleteApiKey,
  updateApiKey
};