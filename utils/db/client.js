const { createClient } = require('@supabase/supabase-js');
const config = require('../../config');

// Create Supabase client instance
const supabase = createClient(
  config.database.supabase.url,
  config.database.supabase.key
);

// Create Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  config.database.supabase.url,
  config.database.supabase.service_role_key
);

module.exports = { supabase, supabaseAdmin };