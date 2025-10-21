const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const { generateId } = require('../utils/idGenerator');

class TransactionService {
  async createTransaction(transactionData) {
    try {
      const transactionId = generateId('tx');
      const now = new Date();
      
      const transaction = await Transaction.create({
        id: transactionId,
        ...transactionData,
        status: 'pending',
        created_at: now,
        updated_at: now
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

  async listTransactions(page, limit, filters) {
    try {
      const transactionFilters = {};
      if (filters.status) transactionFilters.status = filters.status;
      if (filters.from_wallet) transactionFilters.from_wallet = filters.from_wallet;
      if (filters.to_wallet) transactionFilters.to_wallet = filters.to_wallet;
      if (filters.type) transactionFilters.type = filters.type;
      
      return await Transaction.findAll(page, limit, transactionFilters);
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