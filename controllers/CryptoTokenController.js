const CryptoToken = require('../models/CryptoToken');
const { handleAsyncError } = require('../utils/errorHandler');

// Get all crypto tokens
const getAllCryptoTokens = handleAsyncError(async (req, res) => {
  const { page = 1, limit = 10, blockchain_network_id, is_active } = req.query;
  
  const filters = {};
  if (blockchain_network_id) {
    filters.blockchain_network_id = blockchain_network_id;
  }
  if (is_active !== undefined) {
    filters.is_active = is_active === 'true' || is_active === true;
  }
  
  const result = await CryptoToken.findAll(page, limit, filters, req.userWorkspace);
  res.status(200).json({ success: true, ...result });
});

// Get a specific crypto token by ID
const getCryptoTokenById = handleAsyncError(async (req, res) => {
  const cryptoToken = await CryptoToken.findById(req.params.id);
  if (!cryptoToken) {
    return res.status(404).json({ error: 'Crypto token not found' });
  }
  res.status(200).json({ success: true, cryptoToken });
});

// Get crypto tokens by blockchain network
const getCryptoTokensByNetwork = handleAsyncError(async (req, res) => {
  const result = await CryptoToken.findByBlockchainNetworkId(req.params.networkId, req.userWorkspace);
  res.status(200).json({ success: true, cryptoTokens: result });
});

module.exports = {
  getAllCryptoTokens,
  getCryptoTokenById,
  getCryptoTokensByNetwork
};