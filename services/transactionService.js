const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const { generateId } = require('../utils/idGenerator');

class TransactionService {
  async createTransaction(transactionData, userId, userWorkspace = 'testnet') {
    try {
      // Verify that the wallet (if provided) belongs to the user (wallets are cross-workspace)
      if (transactionData.wallet_id) {
        const wallet = await Wallet.findById(transactionData.wallet_id);
        if (!wallet || wallet.user_id !== userId) {
          throw new Error('Invalid wallet ID or wallet does not belong to user');
        }
      }
      
      // Verify that the crypto token (if provided) exists and belongs to the correct workspace
      if (transactionData.crypto_token_id) {
        const cryptoToken = await CryptoToken.findById(transactionData.crypto_token_id);
        if (!cryptoToken) {
          throw new Error('Invalid crypto token ID');
        }
        
        // Verify that the blockchain network for this token belongs to the user's workspace
        const { data: network, error: networkError } = await require('../utils/db/client').supabase
          .from('blockchain_networks')
          .select('*')
          .eq('id', cryptoToken.blockchain_network_id)
          .eq('workspace', userWorkspace)
          .single();

        if (networkError) {
          if (networkError.code === 'PGRST116') { // Record not found
            throw new Error('Crypto token does not belong to user\'s workspace');
          }
          throw new Error(`Error retrieving blockchain network: ${networkError.message}`);
        }
      }
      
      const transactionId = generateId('tx');
      const now = new Date();
      
      const transaction = await Transaction.create({
        id: transactionId,
        ...transactionData,
        status: 'pending',
        created_at: now,
        updated_at: now,
        user_id: userId, // Ensure the transaction is associated with the correct user
        workspace: userWorkspace // Set the transaction's workspace to the user's workspace
      });
      
      return transaction;
    } catch (error) {
      throw new Error(`Error creating transaction: ${error.message}`);
    }
  }

  async getTransactionById(id) {
    try {
      return await Transaction.findById(id);
    } catch (error) {
      throw new Error(`Error retrieving transaction: ${error.message}`);
    }
  }

  async updateTransaction(id, updateData) {
    try {
      return await Transaction.update(id, updateData);
    } catch (error) {
      throw new Error(`Error updating transaction: ${error.message}`);
    }
  }

  async listTransactions(page, limit, filters, userWorkspace = 'testnet') {
    try {
      const transactionFilters = {};
      if (filters.status) transactionFilters.status = filters.status;
      if (filters.from_wallet) transactionFilters.from_wallet = filters.from_wallet;
      if (filters.to_wallet) transactionFilters.to_wallet = filters.to_wallet;
      if (filters.type) transactionFilters.type = filters.type;
      
      return await Transaction.findAll(page, limit, transactionFilters, userWorkspace);
    } catch (error) {
      throw new Error(`Error listing transactions: ${error.message}`);
    }
  }

  async getTransactionStatus(id) {
    try {
      const transaction = await this.getTransactionById(id);
      if (!transaction) return null;
      
      return {
        id,
        status: transaction.status,
        updated_at: transaction.updated_at
      };
    } catch (error) {
      throw new Error(`Error retrieving transaction status: ${error.message}`);
    }
  }

  async refundTransaction(id) {
    try {
      return await Transaction.refund(id);
    } catch (error) {
      throw new Error(`Error refunding transaction: ${error.message}`);
    }
  }
}

module.exports = new TransactionService();