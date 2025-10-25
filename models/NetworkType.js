const { supabase } = require('../utils/db/client');

class NetworkType {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Static method to create a new network type in the database
  static async create(data) {
    const { id, name, description } = data;
    
    const { data: networkType, error } = await supabase
      .from('network_types')
      .insert([{
        id,
        name,
        description
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating network type: ${error.message}`);
    }

    return new NetworkType(networkType);
  }

  // Static method to find a network type by ID
  static async findById(id) {
    const { data: networkType, error } = await supabase
      .from('network_types')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      throw new Error(`Error retrieving network type: ${error.message}`);
    }

    return networkType ? new NetworkType(networkType) : null;
  }

  // Static method to find a network type by name
  static async findByName(name) {
    const { data: networkType, error } = await supabase
      .from('network_types')
      .select('*')
      .eq('name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Record not found
        return null;
      }
      throw new Error(`Error retrieving network type: ${error.message}`);
    }

    return networkType ? new NetworkType(networkType) : null;
  }

  // Static method to update a network type
  static async update(id, updateData) {
    const { data: networkType, error } = await supabase
      .from('network_types')
      .update({ ...updateData, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating network type: ${error.message}`);
    }

    return networkType ? new NetworkType(networkType) : null;
  }

  // Static method to delete a network type
  static async delete(id) {
    const { error } = await supabase
      .from('network_types')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting network type: ${error.message}`);
    }

    return true;
  }

  // Static method to find network types with pagination
  static async findAll(page = 1, limit = 10, filters = {}) {
    let query = supabase.from('network_types').select('*', { count: 'exact' });
    
    if (filters.name) {
      query = query.ilike('name', `%${filters.name}%`);
    }

    query = query.range((page - 1) * limit, page * limit - 1).order('name', { ascending: true });

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Error retrieving network types: ${error.message}`);
    }

    return {
      networkTypes: data.map(networkType => new NetworkType(networkType)),
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    };
  }
}

module.exports = NetworkType;