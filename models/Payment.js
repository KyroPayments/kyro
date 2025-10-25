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
    this.metadata = data.metadata || {};
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create a new payment in the database
  static async create(data) {
    const { id, amount, crypto_token_id, description, wallet_id, user_id, status, expires_at, metadata } = data;
    
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([{
        //id,
        amount,
        crypto_token_id,
        description,
        wallet_id,
        user_id,
        status: status || 'pending',
        expires_at,
        //metadata: metadata || {}
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating payment: ${error.message}`);
    }

    return new Payment(payment);
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

    return payment ? new Payment(payment) : null;
  }

  // Static method to update a payment
  static async update(id, updateData) {
    const { data: payment, error } = await supabase
      .from('payments')
      .update({ ...updateData, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating payment: ${error.message}`);
    }

    return payment ? new Payment(payment) : null;
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

  // Static method to find payments with pagination
  static async findAll(page = 1, limit = 10, filters = {}) {
    let query = supabase.from('payments').select('*', { count: 'exact' });
    
    if (filters.wallet_id) {
      query = query.eq('wallet_id', filters.wallet_id);
    }
    
    if (filters.merchant_id) {
      query = query.eq('merchant_id', filters.merchant_id);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    query = query.range((page - 1) * limit, page * limit - 1).order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error retrieving payments: ${error.message}`);
    }

    return {
      payments: data.map(payment => new Payment(payment)),
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

    return payment ? new Payment(payment) : null;
  }

  // Static method to confirm a payment
  static async confirm(id) {
    const { data: payment, error } = await supabase
      .from('payments')
      .update({ status: 'confirmed', updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error confirming payment: ${error.message}`);
    }

    return payment ? new Payment(payment) : null;
  }
}

module.exports = Payment;