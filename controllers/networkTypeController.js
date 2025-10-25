const NetworkType = require('../models/NetworkType');
const { handleAsyncError } = require('../utils/errorHandler');

// Get all network types
const getAllNetworkTypes = handleAsyncError(async (req, res) => {
  const { page = 1, limit = 10, name } = req.query;
  
  const filters = {};
  if (name) {
    filters.name = name;
  }
  
  const result = await NetworkType.findAll(page, limit, filters);
  res.status(200).json({ success: true, ...result });
});

// Get a specific network type by ID
const getNetworkTypeById = handleAsyncError(async (req, res) => {
  const networkType = await NetworkType.findById(req.params.id);
  if (!networkType) {
    return res.status(404).json({ error: 'Network type not found' });
  }
  res.status(200).json({ success: true, networkType });
});

module.exports = {
  getAllNetworkTypes,
  getNetworkTypeById
};