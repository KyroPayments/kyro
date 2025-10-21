const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function runMigrations() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using service role for migrations
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration in environment variables');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('Starting database migrations...');
  
  try {
    // Read and execute the SQL table creation script
    const fs = require('fs');
    const path = require('path');
    
    const tableScriptPath = path.join(__dirname, 'supabase', 'tables.sql');
    const policyScriptPath = path.join(__dirname, 'supabase', 'policies.sql');
    
    if (fs.existsSync(tableScriptPath)) {
      console.log('Creating tables...');
      // Note: Raw SQL execution is not supported in the client library
      // You would typically run these scripts directly in the Supabase dashboard
      // or use the Supabase CLI
      console.log('Please run the tables.sql script in your Supabase dashboard or using the Supabase CLI');
    }
    
    if (fs.existsSync(policyScriptPath)) {
      console.log('Setting up RLS policies...');
      // Note: RLS policies also need to be applied via dashboard or CLI
      console.log('Please run the policies.sql script in your Supabase dashboard or using the Supabase CLI');
    }
    
    console.log('Migration process completed. Please ensure to run the SQL scripts in your Supabase dashboard.');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

runMigrations();