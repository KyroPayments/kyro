const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const { generateId } = require('../utils/idGenerator');

class PaymentService {
  async createPayment(paymentData) {
    try {
      const paymentId = generateId('pay');
      const now = new Date();
      
      const payment = await Payment.create({
        id: paymentId,
        ...paymentData,
        status: 'pending',
        created_at: now,
        updated_at: now
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

  async listPayments(page, limit, filters) {
    try {
      const paymentFilters = {};
      if (filters.status) paymentFilters.status = filters.status;
      if (filters.wallet_id) paymentFilters.wallet_id = filters.wallet_id;
      
      return await Payment.findAll(page, limit, paymentFilters);
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
      return await Payment.confirm(id);
    } catch (error) {
      throw new Error(`Error confirming payment: ${error.message}`);
    }
  }
}

module.exports = new PaymentService();