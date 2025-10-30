const { supabase } = require('../utils/db/client');

class Payment {
  constructor(data) {
    this.id = data.id;
    this.amount = data.amount;
    this.crypto_token_id = data.crypto_token_id;
    this.description = data.description;
    this.wallet_id = data.wallet_id;
    this.user_id = data.user_id;
    this.status = data.status || 'pending';
    this.expires_at = data.expires_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.workspace = data.workspace;
    this.transaction_hash = data.transaction_hash;
    this.payment_address = data.payment_address;
    this.payer_firstname = data.payer_firstname;
    this.payer_lastname = data.payer_lastname;
    this.payer_email = data.payer_email;
    this.payer_phone = data.payer_phone;
    this.payer_address = data.payer_address;
    this.payer_city = data.payer_city;
    this.payer_state = data.payer_state;
    this.payer_zip = data.payer_zip;
    this.payer_country = data.payer_country;
    this.callback_url = data.callback_url;
    this.cancel_url = data.cancel_url; // Map both field names for compatibility
    
    // Add crypto token information if available
    if (data.crypto_token) {
      this.crypto_token = data.crypto_token;
    }
    
    // Add wallet information if available
    if (data.wallet) {
      this.wallet = data.wallet;
    }
    
    // Add blockchain network information if available
    if (data.blockchain_network) {
      this.blockchain_network = data.blockchain_network;
    }
    
    // Add currency field if available
    this.currency = data.currency || (data.crypto_token ? data.crypto_token.symbol : null);
  }

  // Static method to create a new payment in the database
  static async create(data) {
    const { amount, crypto_token_id, description, wallet_id, user_id, status, expires_at, workspace, callback_url, cancel_url } = data;
    
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        amount,
        crypto_token_id,
        description,
        wallet_id,
        user_id,
        status: status || 'pending',
        expires_at,
        workspace,
        callback_url,
        cancel_url
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating payment: ${error.message}`);
    }

    // After creation, fetch the payment with crypto token info
    return await Payment.findById(payment.id);
  }

  // Static method to find a payment by ID
  static async findById(id) {
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      throw new Error(`Error retrieving payment: ${error.message}`);
    }

    if (payment) {
      // Fetch wallet information
      let wallet = null;
      if (payment.wallet_id) {
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('id, name, address')
          .eq('id', payment.wallet_id)
          .single();
        
        if (!walletError && walletData) {
          wallet = walletData;
        }
      }
      
      // Fetch crypto token information
      let cryptoToken = null;
      if (payment.crypto_token_id) {
        const { data: tokenData, error: tokenError } = await supabase
          .from('crypto_tokens')
          .select('id, name, symbol, blockchain_network_id, contract_address')
          .eq('id', payment.crypto_token_id)
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
              .single();
              
            if (!networkError && networkData) {
              blockchainNetwork = networkData;
            }
          }
          
          // Add blockchain network to the crypto token
          cryptoToken.blockchain_network = blockchainNetwork;
        }
      }
      
      // Combine all the data
      const enhancedPayment = {
        ...payment,
        wallet,
        crypto_token: cryptoToken,
        currency: cryptoToken ? cryptoToken.symbol : null,
        blockchain_network: cryptoToken && cryptoToken.blockchain_network ? cryptoToken.blockchain_network : null
      };
      console.log(enhancedPayment)
      return new Payment(enhancedPayment);
    }
    
    return null;
  }

  // Static method to update a payment
  static async update(id, updateData) {
    // Map cancel_url to error_url for database compatibility
    const dbUpdateData = { ...updateData, updated_at: new Date() };
    // if (dbUpdateData.cancel_url !== undefined) {
    //   dbUpdateData.error_url = dbUpdateData.cancel_url;
    //   delete dbUpdateData.cancel_url;
    // }
    
    const { data: payment, error } = await supabase
      .from('payments')
      .update(dbUpdateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating payment: ${error.message}`);
    }

    if (payment) {
      // Fetch the updated payment with full info
      return await Payment.findById(payment.id);
    }
    
    return null;
  }

  // Static method to delete a payment
  static async delete(id) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting payment: ${error.message}`);
    }

    return true;
  }

  static async findByTxHash(txHash) {
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_hash', txHash)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      throw new Error(`Error retrieving payment by tx hash: ${error.message}`);
    }

    return payment ? new Payment(payment) : null;
  }

  // Static method to find payments with pagination
  static async findAll(page = 1, limit = 10, filters = {}, userWorkspace = 'testnet', userId = null) {
    // First, get the payments with their basic information
    let query = supabase
      .from('payments')
      .select('*', { count: 'exact' });
    
    if (filters.wallet_id) {
      query = query.eq('wallet_id', filters.wallet_id);
    }
    
    if (filters.merchant_id) {
      query = query.eq('merchant_id', filters.merchant_id);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    // Filter by user's workspace
    query = query.eq('workspace', userWorkspace);
    
    // Filter by user ID to ensure user can only see their own payments
    if (userId) {
      query = query.eq('user_id', userId);
    }

    query = query.range((page - 1) * limit, page * limit - 1).order('created_at', { ascending: false });

    const { data: paymentData, error: paymentError, count } = await query;

    if (paymentError) {
      throw new Error(`Error retrieving payments: ${paymentError.message}`);
    }

    // Now fetch related data for each payment
    const enhancedPayments = [];
    for (const payment of paymentData) {
      
      
      // Fetch wallet information
      let wallet = null;
      if (payment.wallet_id) {
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('id, name, address')
          .eq('id', payment.wallet_id)
          .single();
        
        if (!walletError && walletData) {
          wallet = walletData;
        }
      }
      
      // Fetch crypto token information
      let cryptoToken = null;
      if (payment.crypto_token_id) {
        const { data: tokenData, error: tokenError } = await supabase
          .from('crypto_tokens')
          .select('id, name, symbol, blockchain_network_id')
          .eq('id', payment.crypto_token_id)
          .single();
        
        if (!tokenError && tokenData) {
          cryptoToken = tokenData;
          
          // Fetch blockchain network for this token
          let blockchainNetwork = null;
          if (tokenData.blockchain_network_id) {
            const { data: networkData, error: networkError } = await supabase
              .from('blockchain_networks')
              .select('id, name, symbol, workspace')
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
      
      // Combine all the data
      const enhancedPayment = {
        ...payment,
        wallet,
        crypto_token: cryptoToken,
        currency: cryptoToken ? cryptoToken.symbol : null,
        blockchain_network: cryptoToken && cryptoToken.blockchain_network ? cryptoToken.blockchain_network : null
      };
      
      enhancedPayments.push(new Payment(enhancedPayment));
    }

    return {
      payments: enhancedPayments,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }

  // Static method to cancel a payment
  static async cancel(id) {
    const { data: payment, error } = await supabase
      .from('payments')
      .update({ status: 'cancelled', updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error cancelling payment: ${error.message}`);
    }

    if (payment) {
      // Fetch the updated payment with full info
      return await Payment.findById(payment.id);
    }
    
    return null;
  }

  // Static method to confirm a payment
  static async confirm(id, txHash, fromAddress, payerInfo = null) {
    // Prepare the update object with standard fields
    const updateData = {
      status: 'confirmed',
      updated_at: new Date(),
      transaction_hash: txHash,
      payment_address: fromAddress
    };
    
    // Add payer information fields if provided
    if (payerInfo) {
      if (payerInfo.firstname) updateData.payer_firstname = payerInfo.firstname;
      if (payerInfo.lastname) updateData.payer_lastname = payerInfo.lastname;
      if (payerInfo.email) updateData.payer_email = payerInfo.email;
      if (payerInfo.phone) updateData.payer_phone = payerInfo.phone;
      if (payerInfo.address) updateData.payer_address = payerInfo.address;
      if (payerInfo.city) updateData.payer_city = payerInfo.city;
      if (payerInfo.state) updateData.payer_state = payerInfo.state;
      if (payerInfo.zip) updateData.payer_zip = payerInfo.zip;
      if (payerInfo.country) updateData.payer_country = payerInfo.country;
    }
    
    const { data: payment, error } = await supabase
      .from('payments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error confirming payment: ${error.message}`);
    }

    if (payment) {
      
      // Fetch the updated payment with crypto token info
      return await Payment.findById(payment.id);
    }
    
    return null;
  }
}

module.exports = Payment;