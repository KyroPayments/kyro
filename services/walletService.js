const Wallet = require('../models/Wallet');
const NetworkType = require('../models/NetworkType');
const { generateId } = require('../utils/idGenerator');
const { generateWalletAddress } = require('../utils/cryptoUtils');

class WalletService {
  async getNetworkTypeById(id) {
    try {
      return await NetworkType.findById(id);
    } catch (error) {
      throw new Error(`Error retrieving network type: ${error.message}`);
    }
  }

  async createWallet(walletData, userId) {
    try {
      const now = new Date();
      
      // Validate that address and name are provided by the user
      if (!walletData.address) {
        throw new Error('Wallet address must be provided by the user');
      }
      
      if (!walletData.name) {
        throw new Error('Wallet name must be provided by the user');
      }
      
      const wallet = await Wallet.create({
        ...walletData,
        user_id: userId, // Associate wallet with user
        balance: walletData.balance || 0,
        created_at: now,
        updated_at: now
      });
      
      return wallet;
    } catch (error) {
      throw new Error(`Error creating wallet: ${error.message}`);
    }
  }

  async getWalletById(id, userId) {
    try {
      const wallet = await Wallet.findById(id);
      if (wallet && wallet.user_id !== userId) {
        return null; // Wallet doesn't belong to the authenticated user
      }
      return wallet;
    } catch (error) {
      throw new Error(`Error retrieving wallet: ${error.message}`);
    }
  }

  async getWalletBalance(id, userId) {
    try {
      const wallet = await this.getWalletById(id, userId);
      if (!wallet) return null;
      
      // Get the network type to return with the balance
      const networkType = await this.getNetworkTypeById(wallet.network_type_id);
      
      return {
        wallet_id: id,
        balance: wallet.balance,
        network_type: networkType ? networkType.name : null,
        updated_at: new Date()
      };
    } catch (error) {
      throw new Error(`Error retrieving wallet balance: ${error.message}`);
    }
  }

  async depositFunds(walletId, amount, network_type, userId) {
    try {
      const wallet = await this.getWalletById(walletId, userId);
      if (!wallet) {
        return { success: false, error: 'Wallet not found or does not belong to user' };
      }
      
      // In a real implementation, this would interact with blockchain
      // to verify the deposit transaction
      
      // Update balance in database
      const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
      const updatedWallet = await Wallet.update(walletId, {
        balance: newBalance
      });
      
      return {
        success: true,
        wallet_id: walletId,
        amount: parseFloat(amount),
        new_balance: newBalance,
        network_type: network_type
      };
    } catch (error) {
      return {
        success: false,
        error: `Error processing deposit: ${error.message}`
      };
    }
  }

  async withdrawFunds(walletId, amount, toAddress, network_type, userId) {
    try {
      const wallet = await this.getWalletById(walletId, userId);
      if (!wallet) {
        return { success: false, error: 'Wallet not found or does not belong to user' };
      }
      
      const requestedAmount = parseFloat(amount);
      if (parseFloat(wallet.balance) < requestedAmount) {
        return { success: false, error: 'Insufficient balance' };
      }
      
      // In a real implementation, this would create and broadcast
      // a blockchain transaction to transfer funds
      
      // Update balance in database
      const newBalance = parseFloat(wallet.balance) - requestedAmount;
      const updatedWallet = await Wallet.update(walletId, {
        balance: newBalance
      });
      
      return {
        success: true,
        wallet_id: walletId,
        amount: requestedAmount,
        to_address: toAddress,
        new_balance: newBalance,
        network_type: network_type
      };
    } catch (error) {
      return {
        success: false,
        error: `Error processing withdrawal: ${error.message}`
      };
    }
  }

  async listWallets(page, limit, userId) {
    try {
      // Always filter wallets by the authenticated user
      const filters = {}; // The userId parameter will handle the filtering
      
      return await Wallet.findAll(page, limit, filters, userId);
    } catch (error) {
      throw new Error(`Error listing wallets: ${error.message}`);
    }
  }


}

module.exports = new WalletService();