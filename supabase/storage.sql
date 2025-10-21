-- Supabase Storage configuration for Kyro Crypto Payment Platform
-- This would be configured in the Supabase dashboard or via migrations

/*
Storage buckets:
1. wallet-documents - for storing wallet-related documents (KYC, etc.)
   - Public: false
   - Row Level Security: true
   - Policies: Users can upload and access documents related to their wallets

2. transaction-receipts - for storing transaction receipts
   - Public: false
   - Row Level Security: true
   - Policies: Users can access receipts related to their transactions
*/