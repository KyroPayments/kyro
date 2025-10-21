const Wallet = require('../models/Wallet');
const { generateId } = require('../utils/idGenerator');
const { generateWalletAddress } = require('../utils/cryptoUtils');

class WalletService {
  async createWallet(walletData) {
    try {
      const walletId = generateId('wallet');
      const now = new Date();
      
      const wallet = await Wallet.create({
        id: walletId,
        ...walletData,
        balance: walletData.balance || 0,
        created_at: now,
        updated_at: now
      });
      
      // Add initial address if crypto type is specified
      if (walletData.crypto_type) {
        const address = generateWalletAddress(walletData.crypto_type);
        await wallet.addAddress(walletData.crypto_type, address);
      }
      
      return wallet;
    } catch (error) {
      throw new Error(`Error creating wallet: ${error.message}`);
    }
  }

  async getWalletById(id) {
    try {
      return await Wallet.findById(id);
    } catch (error) {
      throw new Error(`Error retrieving wallet: ${error.message}`);
    }
  }

  async getWalletBalance(id) {
    try {
      const wallet = await this.getWalletById(id);
      if (!wallet) return null;
      
      return {
        wallet_id: id,
        balance: wallet.balance,
        crypto_type: wallet.crypto_type,
        updated_at: new Date()
      };
    } catch (error) {
      throw new Error(`Error retrieving wallet balance: ${error.message}`);
    }
  }

  async depositFunds(walletId, amount, cryptoType) {
    try {
      const wallet = await this.getWalletById(walletId);
      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
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
        crypto_type: cryptoType
      };
    } catch (error) {
      return {
        success: false,
        error: `Error processing deposit: ${error.message}`
      };
    }
  }

  async withdrawFunds(walletId, amount, toAddress, cryptoType) {
    try {
      const wallet = await this.getWalletById(walletId);
      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
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
        crypto_type: cryptoType
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
      const filters = {};
      if (userId) {
        filters.user_id = userId;
      }
      
      return await Wallet.findAll(page, limit, filters);
    } catch (error) {
      throw new Error(`Error listing wallets: ${error.message}`);
    }
  }

  async generateAddress(walletId, cryptoType) {
    try {
      const wallet = await this.getWalletById(walletId);
      if (!wallet) return null;
      
      const newAddress = generateWalletAddress(cryptoType || wallet.crypto_type);
      
      // Add address to wallet in the database
      await wallet.addAddress(cryptoType || wallet.crypto_type, newAddress);
      
      return newAddress;
    } catch (error) {
      throw new Error(`Error generating address: ${error.message}`);
    }
  }
}

module.exports = new WalletService();