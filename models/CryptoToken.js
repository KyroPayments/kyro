const { supabase } = require('../utils/db/client');

class CryptoToken {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.symbol = data.symbol;
    this.blockchain_network_id = data.blockchain_network_id;
    this.decimals = data.decimals;
    this.contract_address = data.contract_address;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create a new crypto token in the database
  static async create(data) {
    const { id, name, symbol, blockchain_network_id, decimals, contract_address, is_active } = data;
    
    const { data: token, error } = await supabase
      .from('crypto_tokens')
      .insert([{
        id,
        name,
        symbol,
        blockchain_network_id,
        decimals,
        contract_address,
        is_active
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating crypto token: ${error.message}`);
    }

    return new CryptoToken(token);
  }

  // Static method to find a crypto token by ID
  static async findById(id) {
    const { data: token, error } = await supabase
      .from('crypto_tokens')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      throw new Error(`Error retrieving crypto token: ${error.message}`);
    }

    return token ? new CryptoToken(token) : null;
  }

  // Static method to find crypto tokens by blockchain network ID
  static async findByBlockchainNetworkId(blockchain_network_id, userWorkspace = 'testnet') {
    // First, verify that the blockchain network belongs to the user's workspace
    const { data: network, error: networkError } = await supabase
      .from('blockchain_networks')
      .select('*')
      .eq('id', blockchain_network_id)
      .eq('workspace', userWorkspace)
      .single();

    if (networkError) {
      if (networkError.code === 'PGRST116') { // Record not found
        return []; // Network doesn't belong to user's workspace, return empty array
      }
      throw new Error(`Error retrieving blockchain network: ${networkError.message}`);
    }

    // If network exists and belongs to user's workspace, fetch the tokens
    const { data: tokens, error } = await supabase
      .from('crypto_tokens')
      .select('*')
      .eq('blockchain_network_id', blockchain_network_id)
      .eq('is_active', true);

    if (error) {
      throw new Error(`Error retrieving crypto tokens: ${error.message}`);
    }

    return tokens.map(token => new CryptoToken(token));
  }

  // Static method to find all crypto tokens
  static async findAll(page = 1, limit = 10, filters = {}, userWorkspace = 'testnet') {
    // First, get blockchain networks for the user's workspace to filter tokens
    let blockchainNetworkQuery = supabase
      .from('blockchain_networks')
      .select('id')
      .eq('workspace', userWorkspace);

    const { data: networkIds, error: networkError } = await blockchainNetworkQuery;

    if (networkError) {
      throw new Error(`Error retrieving blockchain networks for workspace: ${networkError.message}`);
    }

    if (networkIds.length === 0) {
      // If no networks exist for the workspace, return empty result
      return {
        cryptoTokens: [],
        total: 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: 0
      };
    }

    // Get the network IDs to filter crypto tokens
    const networkIdsArray = networkIds.map(network => network.id);

    let query = supabase
      .from('crypto_tokens')
      .select('*', { count: 'exact' });
    
    if (filters.blockchain_network_id) {
      query = query.eq('blockchain_network_id', filters.blockchain_network_id);
    } else {
      // Filter tokens by networks that belong to the user's workspace
      query = query.in('blockchain_network_id', networkIdsArray);
    }
    
    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active !== false);
    }

    query = query.range((page - 1) * limit, page * limit - 1).order('name', { ascending: true });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error retrieving crypto tokens: ${error.message}`);
    }

    return {
      cryptoTokens: data.map(token => new CryptoToken(token)),
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }
}

module.exports = CryptoToken;