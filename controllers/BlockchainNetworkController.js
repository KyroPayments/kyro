const BlockchainNetwork = require('../models/BlockchainNetwork');
const { handleAsyncError } = require('../utils/errorHandler');

// Get all blockchain networks
const getAllBlockchainNetworks = handleAsyncError(async (req, res) => {
  const { page = 1, limit = 10, network_type_id } = req.query;
  
  const filters = {};
  if (network_type_id) {
    filters.network_type_id = network_type_id;
  }
  
  const result = await BlockchainNetwork.findAll(page, limit, filters, req.userWorkspace);
  res.status(200).json({ success: true, ...result });
});

// Get a specific blockchain network by ID
const getBlockchainNetworkById = handleAsyncError(async (req, res) => {
  const blockchainNetwork = await BlockchainNetwork.findById(req.params.id);
  if (!blockchainNetwork) {
    return res.status(404).json({ error: 'Blockchain network not found' });
  }
  res.status(200).json({ success: true, blockchainNetwork });
});

module.exports = {
  getAllBlockchainNetworks,
  getBlockchainNetworkById
};