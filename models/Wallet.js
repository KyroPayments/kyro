// Wallet model (schema definition)
// In a real implementation, this would use Mongoose or similar ORM

class Wallet {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.balance = data.balance || 0;
    this.crypto_type = data.crypto_type;
    this.addresses = data.addresses || [];
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.metadata = data.metadata || {};
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}

module.exports = Wallet;