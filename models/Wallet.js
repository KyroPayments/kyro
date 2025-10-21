const { supabase } = require('../utils/db/client');

class Wallet {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.balance = data.balance || 0;
    this.crypto_type = data.crypto_type;
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.metadata = data.metadata || {};
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create a new wallet in the database
  static async create(data) {
    const { id, user_id, balance, crypto_type, is_active, metadata } = data;
    
    const { data: wallet, error } = await supabase
      .from('wallets')
      .insert([{
        id,
        user_id,
        balance: balance || 0,
        crypto_type,
        is_active: is_active !== undefined ? is_active : true,
        metadata: metadata || {}
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating wallet: ${error.message}`);
    }

    return new Wallet(wallet);
  }

  // Static method to find a wallet by ID
  static async findById(id) {
    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      throw new Error(`Error retrieving wallet: ${error.message}`);
    }

    return wallet ? new Wallet(wallet) : null;
  }

  // Static method to update a wallet
  static async update(id, updateData) {
    const { data: wallet, error } = await supabase
      .from('wallets')
      .update({ ...updateData, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating wallet: ${error.message}`);
    }

    return wallet ? new Wallet(wallet) : null;
  }

  // Static method to delete a wallet
  static async delete(id) {
    const { error } = await supabase
      .from('wallets')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting wallet: ${error.message}`);
    }

    return true;
  }

  // Static method to find wallets with pagination
  static async findAll(page = 1, limit = 10, filters = {}) {
    let query = supabase.from('wallets').select('*', { count: 'exact' });
    
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    
    if (filters.crypto_type) {
      query = query.eq('crypto_type', filters.crypto_type);
    }
    
    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    query = query.range((page - 1) * limit, page * limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error retrieving wallets: ${error.message}`);
    }

    return {
      wallets: data.map(wallet => new Wallet(wallet)),
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }

  // Method to add an address to the wallet
  async addAddress(type, address) {
    const { data, error } = await supabase
      .from('wallet_addresses')
      .insert([{
        wallet_id: this.id,
        type,
        address
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error adding address to wallet: ${error.message}`);
    }

    return data;
  }

  // Method to get all addresses for this wallet
  async getAddresses() {
    const { data, error } = await supabase
      .from('wallet_addresses')
      .select('*')
      .eq('wallet_id', this.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error retrieving wallet addresses: ${error.message}`);
    }

    return data;
  }
}

module.exports = Wallet;