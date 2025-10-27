const { supabase } = require('../utils/db/client');

class BlockchainNetwork {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.network_type_id = data.network_type_id;
    this.symbol = data.symbol;
    this.rpc_url = data.rpc_url;
    this.chain_id = data.chain_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create a new blockchain network in the database
  static async create(data) {
    const { id, name, network_type_id, symbol, rpc_url, chain_id } = data;
    
    const { data: network, error } = await supabase
      .from('blockchain_networks')
      .insert([{
        id,
        name,
        network_type_id,
        symbol,
        rpc_url,
        chain_id
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating blockchain network: ${error.message}`);
    }

    return new BlockchainNetwork(network);
  }

  // Static method to find a blockchain network by ID
  static async findById(id) {
    const { data: network, error } = await supabase
      .from('blockchain_networks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      throw new Error(`Error retrieving blockchain network: ${error.message}`);
    }

    return network ? new BlockchainNetwork(network) : null;
  }

  // Static method to find blockchain networks by network type ID
  static async findByNetworkTypeId(network_type_id) {
    const { data: networks, error } = await supabase
      .from('blockchain_networks')
      .select('*')
      .eq('network_type_id', network_type_id);

    if (error) {
      throw new Error(`Error retrieving blockchain networks: ${error.message}`);
    }

    return networks.map(network => new BlockchainNetwork(network));
  }

  // Static method to find all blockchain networks
  static async findAll(page = 1, limit = 10, filters = {}, userWorkspace = 'testnet') {
    let query = supabase
      .from('blockchain_networks')
      .select('*', { count: 'exact' })
      .eq('workspace', userWorkspace); // Filter by user's workspace
    
    if (filters.network_type_id) {
      query = query.eq('network_type_id', filters.network_type_id);
    }

    query = query.range((page - 1) * limit, page * limit - 1).order('name', { ascending: true });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error retrieving blockchain networks: ${error.message}`);
    }

    return {
      blockchainNetworks: data.map(network => new BlockchainNetwork(network)),
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }
}

module.exports = BlockchainNetwork;