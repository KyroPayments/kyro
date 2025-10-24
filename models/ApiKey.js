const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ApiKey = {
  async create(apiKeyData) {
    const { user_id, name, key_hash, permissions } = apiKeyData;
    const { data, error } = await supabase
      .from('api_keys')
      .insert([{ user_id, name, key_hash, permissions }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Return API key without the hash
    const { key_hash: _, ...apiKey } = data;
    return apiKey;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }

    if (!data) return null;

    // Return API key without the hash
    const { key_hash: _, ...apiKey } = data;
    return apiKey;
  },

  async findByUserId(userId) {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true);

    if (error) {
      throw new Error(error.message);
    }

    // Return API keys without the hashes
    return data.map(apiKey => {
      const { key_hash: _, ...cleanApiKey } = apiKey;
      return cleanApiKey;
    });
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from('api_keys')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Return API key without the hash if it exists in the response
    if (data.key_hash) {
      const { key_hash: _, ...apiKey } = data;
      return apiKey;
    }
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return true;
  }
};

module.exports = ApiKey;