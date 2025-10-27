const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// User model
const User = {
  async create(userData) {
    const { email, name, password_hash } = userData;
    // Set default workspace to testnet
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, name, password_hash, workspace: 'testnet' }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Return user without password hash
    const { password_hash: _, ...user } = data;
    return user;
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }

    if (!data) return null;

    // Return user without password hash
    const { password_hash: _, ...user } = data;
    return user;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }

    if (!data) return null;

    // Return user without password hash
    const { password_hash: _, ...user } = data;
    return user;
  },
  
  async updateWorkspace(id, workspace) {
    if (workspace !== 'testnet' && workspace !== 'mainnet') {
      throw new Error('Invalid workspace. Must be either "testnet" or "mainnet"');
    }
    
    const { data, error } = await supabase
      .from('users')
      .update({ workspace, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Return user without password hash
    const { password_hash: _, ...user } = data;
    return user;
  }
};

module.exports = User;