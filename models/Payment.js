// Payment model (schema definition)
// In a real implementation, this would use Mongoose or similar ORM

class Payment {
  constructor(data) {
    this.id = data.id;
    this.amount = data.amount;
    this.currency = data.currency;
    this.wallet_id = data.wallet_id;
    this.merchant_id = data.merchant_id;
    this.status = data.status || 'pending';
    this.transaction_id = data.transaction_id;
    this.metadata = data.metadata || {};
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

module.exports = Payment;