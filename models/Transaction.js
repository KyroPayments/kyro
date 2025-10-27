const { supabase } = require('../utils/db/client');

class Transaction {
  constructor(data) {
    this.id = data.id;
    this.from_wallet = data.from_wallet;
    this.to_wallet = data.to_wallet;
    this.amount = data.amount;
    this.currency = data.currency;
    this.status = data.status || 'pending';
    this.fee = data.fee || 0;
    this.tx_hash = data.tx_hash; // Blockchain transaction hash
    this.block_number = data.block_number;
    this.confirmations = data.confirmations || 0;
    this.type = data.type || 'transfer'; // transfer, payment, refund
    this.metadata = data.metadata || {};
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create a new transaction in the database
  static async create(data) {
    const { id, from_wallet, to_wallet, amount, currency, status, fee, tx_hash, block_number, confirmations, type, metadata } = data;
    
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert([{
        id,
        from_wallet,
        to_wallet,
        amount,
        currency,
        status: status || 'pending',
        fee: fee || 0,
        tx_hash,
        block_number,
        confirmations: confirmations || 0,
        type: type || 'transfer',
        metadata: metadata || {}
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating transaction: ${error.message}`);
    }

    return new Transaction(transaction);
  }

  // Static method to find a transaction by ID
  static async findById(id) {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      throw new Error(`Error retrieving transaction: ${error.message}`);
    }

    return transaction ? new Transaction(transaction) : null;
  }

  // Static method to update a transaction
  static async update(id, updateData) {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .update({ ...updateData, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating transaction: ${error.message}`);
    }

    return transaction ? new Transaction(transaction) : null;
  }

  // Static method to delete a transaction
  static async delete(id) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting transaction: ${error.message}`);
    }

    return true;
  }

  // Static method to find transactions with pagination
  static async findAll(page = 1, limit = 10, filters = {}, userWorkspace = 'testnet') {
    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('workspace', userWorkspace); // Filter by user's workspace
    
    if (filters.from_wallet) {
      query = query.eq('from_wallet', filters.from_wallet);
    }
    
    if (filters.to_wallet) {
      query = query.eq('to_wallet', filters.to_wallet);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    
    if (filters.tx_hash) {
      query = query.eq('tx_hash', filters.tx_hash);
    }

    query = query.range((page - 1) * limit, page * limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error retrieving transactions: ${error.message}`);
    }

    return {
      transactions: data.map(transaction => new Transaction(transaction)),
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }

  // Static method to update transaction status
  static async updateStatus(id, status) {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating transaction status: ${error.message}`);
    }

    return transaction ? new Transaction(transaction) : null;
  }

  // Static method to refund a transaction
  static async refund(id) {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .update({ status: 'refunded', updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error refunding transaction: ${error.message}`);
    }

    return transaction ? new Transaction(transaction) : null;
  }
}

module.exports = Transaction;