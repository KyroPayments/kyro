const { supabase } = require('../utils/db/client');

class Transaction {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.wallet_id = data.wallet_id; // Reference to the wallet involved in the transaction
    this.payment_id = data.payment_id; // Reference to the payment, if applicable
    this.amount = data.amount;
    this.crypto_token_id = data.crypto_token_id; // Reference to crypto token instead of currency
    this.type = data.type; // 'inbound', 'outbound', 'payment', etc.
    this.status = data.status || 'pending';
    this.block_number = data.block_number;
    this.from_address = data.from_address;
    this.to_address = data.to_address;
    this.workspace = data.workspace;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    // Add currency field if crypto_token is available
    if (data.crypto_token) {
      this.currency = data.crypto_token.symbol;
      this.crypto_token = data.crypto_token;
    }
  }

  // Static method to create a new transaction in the database
  static async create(data) {
    const { id, user_id, wallet_id, payment_id, amount, crypto_token_id, type, status, block_number, from_address, to_address, workspace } = data;
    
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert([{
        id,
        user_id,
        wallet_id,
        payment_id,
        amount,
        crypto_token_id,
        type,
        status: status || 'pending',
        block_number,
        from_address,
        to_address,
        workspace
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

    if (transaction) {
      // Fetch crypto token information
      let cryptoToken = null;
      if (transaction.crypto_token_id) {
        const { data: tokenData, error: tokenError } = await supabase
          .from('crypto_tokens')
          .select('id, name, symbol, blockchain_network_id')
          .eq('id', transaction.crypto_token_id)
          .single();
        
        if (!tokenError && tokenData) {
          cryptoToken = tokenData;
          
          // Fetch blockchain network for this token
          let blockchainNetwork = null;
          if (tokenData.blockchain_network_id) {
            const { data: networkData, error: networkError } = await supabase
              .from('blockchain_networks')
              .select('id, name, symbol')
              .eq('id', tokenData.blockchain_network_id)
              .eq('workspace', transaction.workspace) // Filter network by transaction's workspace
              .single();
              
            if (!networkError && networkData) {
              blockchainNetwork = networkData;
            }
          }
          
          // Add blockchain network to the crypto token
          cryptoToken.blockchain_network = blockchainNetwork;
        }
      }
      
      // Combine transaction and crypto token data
      const enhancedTransaction = {
        ...transaction,
        crypto_token: cryptoToken,
        currency: cryptoToken ? cryptoToken.symbol : null
      };
      
      return new Transaction(enhancedTransaction);
    }

    return null;
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
  static async findAll(page = 1, limit = 10, filters = {}, userWorkspace = 'testnet', userId = null) {
    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('workspace', userWorkspace); // Filter by user's workspace
    
    if (filters.wallet_id) {
      query = query.eq('wallet_id', filters.wallet_id);
    }
    
    if (filters.payment_id) {
      query = query.eq('payment_id', filters.payment_id);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.type) {
      query = query.eq('type', filters.type);
    }

    // Filter by user ID to ensure user can only see their own transactions
    if (userId) {
      query = query.eq('user_id', userId);
    }

    query = query.range((page - 1) * limit, page * limit - 1).order('created_at', { ascending: false });

    const { data: transactionData, error, count } = await query;

    if (error) {
      throw new Error(`Error retrieving transactions: ${error.message}`);
    }

    // Enhance each transaction with crypto token information
    const enhancedTransactions = [];
    for (const transaction of transactionData) {
      // Fetch crypto token information
      let cryptoToken = null;
      if (transaction.crypto_token_id) {
        const { data: tokenData, error: tokenError } = await supabase
          .from('crypto_tokens')
          .select('id, name, symbol, blockchain_network_id')
          .eq('id', transaction.crypto_token_id)
          .single();
        
        if (!tokenError && tokenData) {
          cryptoToken = tokenData;
          
          // Fetch blockchain network for this token
          let blockchainNetwork = null;
          if (tokenData.blockchain_network_id) {
            const { data: networkData, error: networkError } = await supabase
              .from('blockchain_networks')
              .select('id, name, symbol')
              .eq('id', tokenData.blockchain_network_id)
              .eq('workspace', userWorkspace) // Filter network by user's workspace
              .single();
              
            if (!networkError && networkData) {
              blockchainNetwork = networkData;
            }
          }
          
          // Add blockchain network to the crypto token
          cryptoToken.blockchain_network = blockchainNetwork;
        }
      }
      
      // Combine transaction and crypto token data
      const enhancedTransaction = {
        ...transaction,
        crypto_token: cryptoToken,
        currency: cryptoToken ? cryptoToken.symbol : null
      };
      
      enhancedTransactions.push(new Transaction(enhancedTransaction));
    }

    return {
      transactions: enhancedTransactions,
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