// Transaction model (schema definition)
// In a real implementation, this would use Mongoose or similar ORM

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
}

module.exports = Transaction;