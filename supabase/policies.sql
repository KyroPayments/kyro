-- Supabase Row Level Security (RLS) Policies for Kyro Crypto Payment Platform

-- Enable RLS for all tables
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for wallets table
CREATE POLICY "Users can view their own wallets" ON wallets
    FOR SELECT TO authenticated
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create wallets" ON wallets
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own wallets" ON wallets
    FOR UPDATE TO authenticated
    USING (auth.uid()::text = user_id);

-- Create policies for wallet_addresses table
CREATE POLICY "Users can view addresses for their wallets" ON wallet_addresses
    FOR SELECT TO authenticated
    USING (wallet_id IN (SELECT id FROM wallets WHERE auth.uid()::text = user_id));

CREATE POLICY "Users can create addresses for their wallets" ON wallet_addresses
    FOR INSERT TO authenticated
    WITH CHECK (wallet_id IN (SELECT id FROM wallets WHERE auth.uid()::text = user_id));

-- Create policies for payments table
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT TO authenticated
    USING (wallet_id IN (SELECT id FROM wallets WHERE auth.uid()::text = user_id));

CREATE POLICY "Users can create payments from their wallets" ON payments
    FOR INSERT TO authenticated
    WITH CHECK (wallet_id IN (SELECT id FROM wallets WHERE auth.uid()::text = user_id));

CREATE POLICY "Users can update their own payments" ON payments
    FOR UPDATE TO authenticated
    USING (wallet_id IN (SELECT id FROM wallets WHERE auth.uid()::text = user_id));

-- Create policies for transactions table
CREATE POLICY "Users can view their own transaction records" ON transactions
    FOR SELECT TO authenticated
    USING (
        from_wallet IN (SELECT id FROM wallets WHERE auth.uid()::text = user_id)
        OR to_wallet IN (SELECT id FROM wallets WHERE auth.uid()::text = user_id)
    );

CREATE POLICY "Service role can manage all transactions" ON transactions
    FOR ALL TO service_role
    USING (true);