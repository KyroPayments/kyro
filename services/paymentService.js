const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const CryptoToken = require('../models/CryptoToken');
const { generateId } = require('../utils/idGenerator');

class PaymentService {
  async createPayment(paymentData, userId, userWorkspace = 'testnet') {
    try {
      // Verify that the wallet belongs to the user (wallets are cross-workspace)
      const wallet = await Wallet.findById(paymentData.wallet_id);
      if (!wallet || wallet.user_id !== userId) {
        throw new Error('Invalid wallet ID or wallet does not belong to user');
      }
      
      // Verify that the crypto token exists and belongs to the correct workspace
      // For this, we need to check that the token's blockchain network is in the user's workspace
      const cryptoToken = await CryptoToken.findById(paymentData.crypto_token_id);
      if (!cryptoToken) {
        throw new Error('Invalid crypto token ID');
      }
      
      // Verify that the blockchain network for this token belongs to the user's workspace
      // We'll need to check the blockchain network the token is associated with
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
      
      const paymentId = generateId('pay');
      const now = new Date();
      
      // Include the user's workspace when creating the payment
      const payment = await Payment.create({
        id: paymentId,
        ...paymentData,
        status: 'pending',
        created_at: now,
        updated_at: now,
        workspace: userWorkspace // Set the payment's workspace to the user's workspace
      });
      
      return payment;
    } catch (error) {
      throw new Error(`Error creating payment: ${error.message}`);
    }
  }

  async getPaymentById(id) {
    try {
      return await Payment.findById(id);
    } catch (error) {
      throw new Error(`Error retrieving payment: ${error.message}`);
    }
  }

  async updatePayment(id, updateData) {
    try {
      return await Payment.update(id, updateData);
    } catch (error) {
      throw new Error(`Error updating payment: ${error.message}`);
    }
  }

  async listPayments(page, limit, filters, userWorkspace = 'testnet') {
    try {
      const paymentFilters = {};
      if (filters.status) paymentFilters.status = filters.status;
      if (filters.wallet_id) paymentFilters.wallet_id = filters.wallet_id;
      
      return await Payment.findAll(page, limit, paymentFilters, userWorkspace);
    } catch (error) {
      throw new Error(`Error listing payments: ${error.message}`);
    }
  }

  async cancelPayment(id) {
    try {
      return await Payment.cancel(id);
    } catch (error) {
      throw new Error(`Error cancelling payment: ${error.message}`);
    }
  }

  async confirmPayment(id) {
    try {
      // Get the payment to verify its current status
      const payment = await Payment.findById(id);
      if (!payment) {
        throw new Error('Payment not found');
      }
      
      // Only allow confirmation for pending payments
      if (payment.status !== 'pending') {
        throw new Error(`Payment cannot be confirmed. Current status: ${payment.status}`);
      }
      
      return await Payment.confirm(id);
    } catch (error) {
      throw new Error(`Error confirming payment: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();